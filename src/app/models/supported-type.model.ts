export class SupportedFileType {
  public typeName!: string;
  public typeExtensions!: Array<string>;

  constructor(name: string, extensions: Array<string>) {
    this.typeName = name;
    this.typeExtensions = extensions;
  }
}
