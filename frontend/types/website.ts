export interface Block {
  id:   string;
  type: string;
  data: Record<string, unknown>;
}

export interface BlockType {
  type:     string;
  label:    string;
  icon:     string;
  category: string;
}

export interface WebsitePage {
  id:               number;
  title:            string;
  slug:             string;
  json_content:     Block[];
  meta_title?:      string;
  meta_description?:string;
  og_image?:        string;
  is_published:     boolean;
  is_homepage:      boolean;
  page_type:        string;
  order:            number;
  published_at?:    string;
  created_at:       string;
  updated_at:       string;
}
