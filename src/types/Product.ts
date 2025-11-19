// ✅ Product type definition — matches your backend structure
export interface Product {
  LotNo: string;
  ItemNo: string;
  Description: string;
  GWt: number;
  OWt: number;
  SubCat_Id: number;
  OAmt: number;
  Sold: string | null;
  LabAmt: number;
  LabType: string;
  Wast: number;
  WType: string;
  Wastage: number;
  Melting: number;
  Age: number;
  HMCode: string;
  Code: string;
  Cat_Id?: number;
  SubCategory?: string;
  Location?: string;
  SRate?: number;
  TotWt?: number;
  Pcs?: number;
  RSize?: string;
  BoxNo?: string;
  Tunch?: string;
  GorS?: string;
  images?: ProductImage[] | string[];
}

export interface ProductImage {
  ImageName?: string;
  FilePath: string;
}
