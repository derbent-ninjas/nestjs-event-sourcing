export class TSRange {
  start!: Date;
  end!: Date;

  static fromRaw(raw: TSRange): TSRange {
    const dto = new TSRange();
    dto.start = raw.start;
    dto.end = raw.end;
    return dto;
  }
}
