import { Component, EventEmitter, Input, OnInit, Output, OnChanges, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// Models
import { PartInformation, PartLocation } from '../../../../models/parts-location.model';

// Services
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { LocalStorageKeys } from '../../../../shared/constants/local-storage-keys';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class PartLocationComponent implements OnInit, OnChanges, DoCheck {
  @Input() levelInfo!: PartInformation[];
  @Input() locationResponse!: PartLocation[];
  @Input() copyId!: number;
  @Output() selectedPart = new EventEmitter<any>();

  public levelHierarchy: boolean[] = [];
  private serviceRequestNumber!: string;
  private assetId!: string;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Initialize route parameters
    this.serviceRequestNumber = this.route.snapshot.params['serviceRequestNumber'];
    this.assetId = this.route.snapshot.params['assetId'];
  }

  ngOnChanges() {
    // Update route parameters when inputs change
    this.serviceRequestNumber = this.route.snapshot.params['serviceRequestNumber'];
    this.assetId = this.route.snapshot.params['assetId'];
  }

  ngDoCheck() {
    // Check if level info is available and load location data
    if (this.levelInfo && this.levelInfo.length > 0) {
      this.loadLocation();
    }
  }

  display(): boolean {
    // Check if any part is selected in the level info
    const index = this.levelInfo.findIndex(part => part.isSelected);
    return index > -1;
  }

  onClick(part: PartInformation) {
    // Handle part selection
    const index = this.levelInfo.findIndex(p => p.id === part.id);
    if (index > -1) {
      this.levelInfo[index].isSelected = true;
      this.selectedPart.emit(part);
    }
  }

  loadLocation() {
    // Load location data for each part level
    this.levelInfo.forEach((partLevel: PartInformation) => {
      this.levelHierarchy = [];
      let checkAllLocationByPartId = this.isPartLocationSelected(
        partLevel,
        this.copyId
      );
      let partLocationExists = !checkAllLocationByPartId.includes(false);
      partLevel.isAreaPathAlreadySelected = partLevel.isAreaPathLevelPartialSelect
        ? false
        : partLocationExists;
    });
  }

  isPartLocationSelected(part: PartInformation, copyId: number): boolean[] {
    // Check if part location is selected in the hierarchy
    if (part.partLocationId == null) {
      // Find parts by part ID and copy ID
      let getPartByPartIdCopyId = this.locationResponse.filter(
        (res: PartLocation) => res.partId == part.partid && res.copyId == copyId
      );

      if (getPartByPartIdCopyId.length > 0) {
        // Get location by part ID and level ID
        let getLocationbyPartIdLevelId = getPartByPartIdCopyId[0]?.pcrLocationPaths?.filter(
          (partInformation: PartInformation) =>
            partInformation.level === part.level + 1 &&
            partInformation.parentId === part.partUiPathId &&
            partInformation.partUiPath === part.partUiPath
        );

        // Recursively check child locations
        getLocationbyPartIdLevelId?.forEach(k => {
          this.isPartLocationSelected(k, copyId);
        });
      }
    } else {
      // Check local storage for selected path
      let localStorageKey = this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.ApiResponse;

      let localStorageDataJson = this.localStorageService.readLocalStorage(localStorageKey);

      if (localStorageDataJson) {
        let localStorageData = JSON.parse(localStorageDataJson);

        if (localStorageData && localStorageData.length > 0) {
          // Get formed paths for this part
          let getPathFormed = localStorageData
            .filter((res: PartLocation) => res.partId == part.partid)
            .map((pf: PartLocation) => pf.pathFormed);

          // Check if current path exists in formed paths
          let partLocationExists =
            getPathFormed.length > 0
              ? getPathFormed.filter(
                  (a: number[]) =>
                    a.toString().replace(/,/gi, '\\') === part.partUiPath
                )
              : [];

          if (partLocationExists && partLocationExists.length > 0) {
            this.levelHierarchy.push(true);
          } else {
            this.levelHierarchy.push(false);
          }
        } else {
          this.levelHierarchy.push(false);
        }
      } else {
        this.levelHierarchy.push(false);
      }
    }
    return this.levelHierarchy;
  }
}
