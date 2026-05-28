export interface CapitalGainsData {
  stcg: { profits: number; losses: number };
  ltcg: { profits: number; losses: number };
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGainsData;
}

const fetchCapitalGains = (): Promise<CapitalGainsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        capitalGains: {
          stcg: { profits: 70200.88, losses: 1548.53 },
          ltcg: { profits: 5020, losses: 3050 },
        },
      });
    }, 800);
  });
};

export { fetchCapitalGains };
