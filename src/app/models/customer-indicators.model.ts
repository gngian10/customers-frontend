export interface BirthRateByMonthYear {
  mes: number;
  anio: number;
  cantidad: number;
  tasaNatalidad: number;
}

export interface CustomerIndicators {
  natalidadPorMesAnio: BirthRateByMonthYear[];
  mesAnioConMayorNatalidad: BirthRateByMonthYear | null;
  mesAnioConMenorNatalidad: BirthRateByMonthYear | null;
}
