export interface ThemeColors {
  primary: string;
  secondary: string;
}

export interface ThemeData {
  _id: string;
  themeId: string;
  Logo: string;
  showName: boolean;
  Favicon: string;
  HeroImg: string;
  previousHeroImg: string[];
  homePageBanner: {
    Active: string[];
    Previous: string[];
  };
  font: string;
  colors: {
    reset: ColorScheme;
    current: ColorScheme;
  };
}

interface ColorScheme {
  primary: string;
  secondary: string;
}

export interface StoreLocation {
  lat: string;
  lng: string;
}

export interface StoreDetails {
  _id: string;
  store_id: string;
  domain: string;
  menusharingcode: string;
  name: string;
  state: {
    id: string;
    name: string;
    countryId: string;
  };
  town: {
    id: string;
    name: string;
    stateId: string;
  };
  country: {
    id: string;
    name: string;
    countryPhoneCode: string;
    currency: string;
    isoAlpha2CountryCode: string;
    currencyHtml: string;
  };
  store_mobile: {
    value: string;
    valid: boolean;
  };
  store_email: {
    value: string;
    valid: boolean;
  };
  address_line: string;
  timezone: {
    id: string;
    name: string;
    countryId: string;
  };
}

export interface ApiResponse {
  results: {
    theme: ThemeData;
    store: StoreDetails;
    social: Social;
    pages: Pages;
    timing: Timing;
    domainPages: DomainPage[];
  };
  message: string;
  code: number;
}

export interface ThemeState {
  theme: ThemeData | null;
  store: StoreDetails | null;
  loading: boolean;
  error: string | null;
}

export interface Social {
  Social: {
    facebook: string;
    linkedin: string;
    x: string;
    instagram: string;
    Youtube: string;
    Pinterest: string;
  };
  app: {
    ios: string;
    android: string;
  };
  _id: string;
  StoreId: string;
  Title: string;
  Description: string;
  Img: string;
}

export interface Pages {
  _id: string;
  store_id: string;
  policies: string;
  condition: string;
  refund: string;
}

export interface Timing {
  _id: string;
  storeId: string;
  isDelivery: boolean;
  currentDay: boolean;
  totalNumber: string;
  sunday: TimeSlot[];
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  [key: string]: any;
}

interface TimeSlot {
  from: string;
  to: string;
  _id: string;
}

export interface DomainPage {
  _id: string;
  domainId: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
} 