export interface Exchange {
  [symbolRef: string]: {
    to: {
      [symbolToUse: string]: number
    }
  }
}

export interface ExchangeResponse {
  RAW: {
    [symbolRef: string]: {
      [symbolToUse: string]: {
        TYPE: string
        MARKET: string
        FROMSYMBOL: string
        TOSYMBOL: string
        FLAGS: string
        PRICE: number
        LASTUPDATE: number
        MEDIAN: number
        LASTVOLUME: number
        LASTVOLUMETO: number
        LASTTRADEID: string
        VOLUMEDAY: number
        VOLUMEDAYTO: number
        VOLUME24HOUR: number
        VOLUME24HOURTO: number
        OPENDAY: number
        HIGHDAY: number
        LOWDAY: number
        OPEN24HOUR: number
        HIGH24HOUR: number
        LOW24HOUR: number
        LASTMARKET: string
        VOLUMEHOUR: number
        VOLUMEHOURTO: number
        OPENHOUR: number
        HIGHHOUR: number
        LOWHOUR: number
        TOPTIERVOLUME24HOUR: number
        TOPTIERVOLUME24HOURTO: number
        CHANGE24HOUR: number
        CHANGEPCT24HOUR: number
        CHANGEDAY: number
        CHANGEPCTDAY: number
        CHANGEHOUR: number
        CHANGEPCTHOUR: number
        CONVERSIONTYPE: string
        CONVERSIONSYMBOL: string
        SUPPLY: number
        MKTCAP: number
        TOTALVOLUME24H: number
        TOTALVOLUME24HTO: number
        TOTALTOPTIERVOLUME24H: number
        TOTALTOPTIERVOLUME24HTO: number
        IMAGEURL: string
      }
    }
  }

  DISPLAY: {
    [symbolRef: string]: {
      [symbolToUse: string]: {
        FROMSYMBOL: string
        TOSYMBOL: string
        MARKET: string
        PRICE: string
        LASTUPDATE: string
        LASTVOLUME: string
        LASTVOLUMETO: string
        LASTTRADEID: string
        VOLUMEDAY: string
        VOLUMEDAYTO: string
        VOLUME24HOUR: string
        VOLUME24HOURTO: string
        OPENDAY: string
        HIGHDAY: string
        LOWDAY: string
        OPEN24HOUR: string
        HIGH24HOUR: string
        LOW24HOUR: string
        LASTMARKET: string
        VOLUMEHOUR: string
        VOLUMEHOURTO: string
        OPENHOUR: string
        HIGHHOUR: string
        LOWHOUR: string
        TOPTIERVOLUME24HOUR: string
        TOPTIERVOLUME24HOURTO: string
        CHANGE24HOUR: string
        CHANGEPCT24HOUR: string
        CHANGEDAY: string
        CHANGEPCTDAY: string
        CHANGEHOUR: string
        CHANGEPCTHOUR: string
        CONVERSIONTYPE: string
        CONVERSIONSYMBOL: string
        SUPPLY: string
        MKTCAP: string
        TOTALVOLUME24H: string
        TOTALVOLUME24HTO: string
        TOTALTOPTIERVOLUME24H: string
        TOTALTOPTIERVOLUME24HTO: string
        IMAGEURL: string
      }
    }
  }
}
