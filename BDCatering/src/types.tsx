import { StackNavigationOptions } from "@react-navigation/stack";

export type RootStackParamList = {
  Root: { screen: string; params: { q: string } };
  Login: undefined;
  NotFound: undefined;
  Search: undefined;
  Product: { item: any };
  Cart: undefined;
  CheckCart: { cart: any; total: any };
  OrderDetail: { item: any };
  Payment: { id: any };
  SearchResult: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};
export type StackParamList = RootStackParamList &
  AuthStackParamList &
  TabParamList;

export interface IScreen {
  component: any;
  options?: StackNavigationOptions;
}
export type TabParamList = {
  Home: undefined;
  Order: undefined;
  Personal: undefined;
};
export interface IHeader {
  title: string;
  onPress?: any;
  hasBack?: boolean;
  color?: string;
}

export type StorageParamList = {
  token: undefined;
};
