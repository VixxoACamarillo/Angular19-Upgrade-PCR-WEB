import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// Kendo UI Modules
import { GridModule, SelectableSettings } from '@progress/kendo-angular-grid';

// Models
import { PartsSearchModel } from '../../../../models/parts-search.model';
import { AddPartsColumnsModel } from '../../../../models/add-parts-columns.model';
import { PartModel } from '../../../../models/part.model';
import { PartFilterModel } from '../../../../models/part-filter.model';

// Services
import { PartService } from '../../../../services/parts.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

// Constants
import { LocalStorageKeys } from '../../../../shared/constants/local-storage-keys';

// RxJS
import { Subject } from 'rxjs';

// Note: These components need to be migrated to standalone or imported from a library
// For now, we'll comment them out and add them back when available
// import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
// import { VixxoGridComponent } from 'vixxo-ui';

@Component({
  selector: 'app-parts',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    // SearchBarComponent, // Add when converted to standalone
    // VixxoGridComponent, // Add when vixxo-ui is updated for Angular 19
  ],
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})
export class PartsComponent implements OnInit {
  public subject: Subject<string> = new Subject();
  public searchFilter = '';
  public isDataLoading = false;
  public partModel: PartModel[] = [];
  public partsData: any = { results: [], paging: {} };
  public selectedParts: PartModel[] = [];
  public selectedItems: PartModel[] = [];
  public selectedPartFilter!: PartFilterModel;
  public columnsModel = new AddPartsColumnsModel();
  public openInputFilterList = false;
  public endOfResults = false;
  public searchString: string = '';
  public onInitialLoad: boolean = false;

  public partSearchModel: PartsSearchModel = new PartsSearchModel();

  public selectableSettings: SelectableSettings = {
    enabled: true,
    mode: 'multiple',
    checkboxOnly: false
  };

  private serviceRequestNumber!: string;
  private assetId!: string;
  private cellClicked: boolean = false;
  private existingPartsResult: PartModel[] = [];

  public innerWidth: number = window.innerWidth;

  @Output() PartSelected = new EventEmitter<{ isPartSelected: boolean }>();

  constructor(
    private partService: PartService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.serviceRequestNumber = this.route.snapshot.params['serviceRequestNumber'];
    this.assetId = this.route.snapshot.params['assetId'];

    // Initialize search parameters
    this.partSearchModel.pageNumber = 1;
    this.partSearchModel.pageSize = 100;
    this.partSearchModel.searchString = '';

    // Load existing selected parts from local storage
    const storageData = JSON.parse(
      this.localStorageService.readLocalStorage(
        this.serviceRequestNumber + '-' + this.assetId + '-' + LocalStorageKeys.SelectedParts
      ) || '[]'
    );

    if (storageData && storageData.length) {
      this.onInitialLoad = true;
      // Ensure isSelected is set for all loaded parts
      this.selectedParts = storageData.map((part: PartModel) => ({ ...part, isSelected: part.isSelected ?? false }));
      this.selectedItems = this.selectedParts;
    }

    this.addOrUpdateSearchParams();
    this.getParts();
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.partsData.results && this.partsData.results.length > 0) {
      this.updatePartDisplayFormat();
    }
  }

  private addOrUpdateSearchParams() {
    this.partSearchModel.pageNumber = 1;
    this.partSearchModel.pageSize = 100;
    this.partSearchModel.searchString = this.searchString;

    // Add machine product ID if available
    const machineProductId = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber + '-' + this.assetId + '-' + LocalStorageKeys.MachineProductId
    );
    if (machineProductId) {
      this.partSearchModel.machineProductId = parseInt(machineProductId);
    }
  }

  public getParts() {
    this.isDataLoading = true;

    this.partService
      .getPartsByParam(this.partSearchModel)
      .subscribe((response: any) => {
        if (response && response.results && response.results.length === 0) {
          this.endOfResults = true;
          this.partSearchModel.pageNumber = response.totalPages;
          this.isDataLoading = false;
        } else {
          if (response && response.results && response.results.length < 99) {
            this.isDataLoading = false;
            this.endOfResults = true;
          } else {
            this.endOfResults = false;
            this.isDataLoading = false;
          }

          this.existingPartsResult = this.partModel;
          this.partModel = [];
          this.partsData.results = [];
          // Ensure isSelected is set for all API results
          this.partsData.results = response.results.map((part: PartModel) => ({ ...part, isSelected: part.isSelected ?? false }));

          if (this.partsData && this.partsData.results) {
            this.updatePartDisplayFormat();

            if (this.existingPartsResult && this.existingPartsResult.length) {
              this.partModel = [...this.existingPartsResult, ...this.partsData.results];

              // Remove duplicates based on part number
              const uniquePartsMap = new Map();
              this.partModel.forEach(part => {
                if (!uniquePartsMap.has(part.number)) {
                  uniquePartsMap.set(part.number, part);
                }
              });
              this.partModel = Array.from(uniquePartsMap.values());
            } else {
              this.partModel = this.partsData.results;
            }
          }

          this.getSelectedDatatoBindtoGrid();
          this.disableandEnableButton();
        }
      }, (error) => {
        this.isDataLoading = false;
        console.error('Error loading parts:', error);
      });
  }

  private updatePartDisplayFormat() {
    this.partsData.results.forEach((value: any) => {
      if (this.innerWidth <= 984) {
        value.partNumber = 'Part #: ' + value.number;
        value.skuNumber = value.sku.map((snum: any) => 'SKU: ' + snum);
      } else {
        value.partNumber = value.number;
        value.skuNumber = value.sku;
      }
    });
  }

  public infinitySearch() {
    if (!this.endOfResults) {
      this.partSearchModel.pageNumber = (this.partSearchModel.pageNumber || 1) + 1;
      this.getParts();
    }
  }

  public onTypeSearch(event: any) {
    const searchValue = event.target ? event.target.value : event;
    this.searchString = searchValue;
    this.partSearchModel.searchString = searchValue;
    this.partSearchModel.pageNumber = 1;
    this.endOfResults = false;
    this.partModel = []; // Clear existing results for new search
    this.getParts();
  }

  public selectedRowChange(event: any) {
    this.selectedItems = event.selectedRows || [];
    this.selectedParts = this.selectedItems;

    // Update selected state in part model
    this.partModel.forEach(part => {
      part.isSelected = this.selectedParts.some(selectedPart => selectedPart.id === part.id);
    });

    this.updateLocalStorage();
    this.disableandEnableButton();
  }

  public onPartToggle(part: PartModel) {
    part.isSelected = !part.isSelected;

    if (part.isSelected) {
      if (!this.selectedParts.find(p => p.id === part.id)) {
        this.selectedParts.push(part);
      }
    } else {
      this.selectedParts = this.selectedParts.filter(p => p.id !== part.id);
    }

    this.selectedItems = this.selectedParts;
    this.updateLocalStorage();
    this.disableandEnableButton();
  }

  public onCellClickEvent(event: any) {
    // Handle cell click events if needed
    this.cellClicked = true;
  }

  private getSelectedDatatoBindtoGrid() {
    if (this.partModel && this.partModel.length) {
      this.partModel.forEach((part: PartModel) => {
        const index = this.selectedParts.findIndex(
          selectedPart => selectedPart.number === part.number
        );
        if (index > -1) {
          part.isSelected = true;
        }
      });
    }
  }

  private updateLocalStorage() {
    this.localStorageService.writeLocalStorage(
      this.serviceRequestNumber + '-' + this.assetId + '-' + LocalStorageKeys.SelectedParts,
      JSON.stringify(this.selectedParts)
    );
  }

  private disableandEnableButton() {
    const isPartSelected = this.selectedParts && this.selectedParts.length > 0;
    this.PartSelected.emit({ isPartSelected });
  }

  // Add this getter for selectedItemIds used in the template
  get selectedItemIds(): number[] {
    return this.selectedItems ? this.selectedItems.map(item => item.id) : [];
  }

  // Add this method for isArray used in the template
  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}
