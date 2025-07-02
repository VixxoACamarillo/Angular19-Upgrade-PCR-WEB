import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UploadModule } from '@progress/kendo-angular-upload';

// Models
import { SupportedFileType } from '../../../../models/supported-type.model';

// Services
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { LocalStorageKeys } from '../../../../shared/constants/local-storage-keys';

// Pipes
import { BytesDisplayPipe } from '../../../../shared/pipes/bytes-display.pipe';

// Note: Some imports will show errors until we create them
// import { VixxoApiService } from '../../../../shared/services/vixxo-api.service';
// import { ServiceRequestAttachment } from '../../../../shared/models/service-request-attachment.model';
// import { ServiceRequestDetailModel } from '../../../../shared/models/service-request-detail.model';
// import { FileUploadResult } from '../../../../shared/models/file-upload-result.model';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    UploadModule,
    BytesDisplayPipe
  ],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  private readonly maxFileSizeInBytes: number = 7864320;
  private maxSize!: string;
  private allowedTypes!: Array<string>;

  public serviceRequestNumber!: string;
  public attachmentsData: Array<any> = [];
  public cancelFileUpload = false;
  public showFileUploadModal: Boolean = false;
  public showLargeFile: Boolean = false;

  // Note: Will show error until we create the model
  // public currentServiceRequest!: ServiceRequestDetailModel;

  public loader: boolean = false;
  public openAddNoteModal: boolean = false;
  public enteredNote!: string;
  public savedNote!: string;
  public errorMessage = { message: '' };
  public sizeErrorMessage = { message: '' };
  private assetId!: string;

  private readonly supportedTypes: Array<SupportedFileType> = [
    new SupportedFileType('jpeg', ['jpeg']),
    new SupportedFileType('jpg', ['jpg']),
    new SupportedFileType('png', ['png']),
    new SupportedFileType('tiff', ['tiff']),
    new SupportedFileType('heic', ['heic'])
  ];

  constructor(
    // private vixxoAPIService: VixxoApiService, // Will add later
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {
    let converter: BytesDisplayPipe = new BytesDisplayPipe();
    this.maxSize = converter.transform(this.maxFileSizeInBytes);
    this.sizeErrorMessage.message =
      'Uploads must be less than ' +
      this.maxSize +
      ', please try uploading a smaller file.';

    this.errorMessage.message = 'Accepted file types for attachments are ';
    let typeNames: Array<string> = this.supportedTypes.map(
      type => type.typeName
    );
    let typeNamesDisplay: string = typeNames.join(', ');
    this.errorMessage.message += typeNamesDisplay + '.';

    this.allowedTypes = this.supportedTypes
    .map((type) => type.typeExtensions)
    .flat();
  }

  public ngOnInit() {
    this.loader = true;
    this.serviceRequestNumber = this.route.snapshot.params['serviceRequestNumber'];
    this.assetId = this.route.snapshot.params['assetId'];

    // Temporarily commented out until we create the models
    /*
    let serializedServiceRequest: string = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.ServiceRequestObject
    ) || '';
    this.currentServiceRequest = <ServiceRequestDetailModel>(
      JSON.parse(serializedServiceRequest)
    );
    */

    this.savedNote = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.Note
    ) || '';

    const attachmentsJson = this.localStorageService.readLocalStorage(
      this.serviceRequestNumber +
        '-' +
        this.assetId +
        '-' +
        LocalStorageKeys.ServiceRequestAttachments
    );

    this.attachmentsData = attachmentsJson ? JSON.parse(attachmentsJson) : [];
    this.loader = false;
  }

  addNote() {
    this.openAddNoteModal = true;
  }

  closeAddNoteModal(close: any) {
    if (close.status === 'change') {
      this.savedNote = this.enteredNote;
      this.localStorageService.writeLocalStorage(
        this.serviceRequestNumber +
          '-' +
          this.assetId +
          '-' +
          LocalStorageKeys.Note,
        this.enteredNote
      );
    }
    this.openAddNoteModal = false;
  }

  setPcrNotes(event: any) {
    this.enteredNote = event.target.value;
  }

  // File upload methods will be implemented when we add VixxoApiService
  public onFileRead(params: any) {
    // Implementation will be added later when we have all services
    console.log('File upload not yet implemented:', params);
  }

  public onFileSelect(event: any) {
    console.log('File selected:', event.files);
    // For now, just prevent the upload
    if (event.preventDefault) {
      event.preventDefault();
    }
  }

  public close(event: any): void {
    this.showFileUploadModal = false;
    this.showLargeFile = false;
    this.cancelFileUpload = true;
    this.cleanAttachments();
    this.attachmentsData = this.attachmentsData.slice();
  }

  private cleanAttachments() {
    if (
      this.attachmentsData &&
      this.attachmentsData.length > 0 &&
      this.attachmentsData[0].attachments != undefined
    ) {
      this.attachmentsData.shift();
    }
  }
}
