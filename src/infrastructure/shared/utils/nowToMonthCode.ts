import { MonthCodeEnum } from '../../../storage/domain/aggregates/stockMonth/enums/monthCode.enum';

export const nowToMonthCode = (now: Date): MonthCodeEnum => {
  const map: Record<number, MonthCodeEnum> = {
    0: MonthCodeEnum.JA,
    1: MonthCodeEnum.FE,
    2: MonthCodeEnum.MR,
    3: MonthCodeEnum.AP,
    4: MonthCodeEnum.MY,
    5: MonthCodeEnum.JN,
    6: MonthCodeEnum.JL,
    7: MonthCodeEnum.AU,
    8: MonthCodeEnum.SE,
    9: MonthCodeEnum.OC,
    10: MonthCodeEnum.NV,
    11: MonthCodeEnum.DE,
  };

  return map[now.getMonth()];
};
