export interface Client {
    id: string;
    name: string;
    totalEquipment: number;
    billableEquipment: number;
    totalBilling: number;
  }
  
  export interface Equipment {
    id: string;
    "Host Name": string;
    "Host IP/DNS": string;
    "Host ID": string;
    "Category Name": string;
    Template: string;
    "Company Name": string;
    Description: string;
    Enabled: string;
    "Business Impact": number;
    "Host Mode": string;
    "Check Template": string;
    "Action Template": string;
  }
  
  export interface DashboardData {
    clients: Client[];
    totalEquipment: number;
    totalBillableEquipment: number;
    totalRevenue: number;
  }
  
  export interface Settings {
    pricePerEquipment: number;
    cacheExpiration: number;
  }