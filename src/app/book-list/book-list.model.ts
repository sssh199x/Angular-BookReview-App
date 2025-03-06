// Interface for book work details
export interface Work {
  title: string;
  key: string;
  author_keys: string[];
  author_names: string[];
  first_publish_year: number;
  lending_edition_s: string | null;
  edition_key: string[];
  cover_id: number | null;
  cover_edition_key: string | null;
}

// Interface for a reading log entry
export interface BooksList {
  work: Work;
  logged_edition: string | null;
  logged_date: string | null;
}

// Interface for the API response
export interface Books {
  page: number;
  numFound: number;
  reading_log_entries: BooksList[];
}



