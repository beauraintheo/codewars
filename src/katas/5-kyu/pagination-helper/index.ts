export class PaginationHelper<T> {
  private collection: T[];
  private itemsPerPage: number;

  constructor(collection: T[], itemsPerPage: number) {
    this.collection = collection;
    this.itemsPerPage = itemsPerPage;
  }

  itemCount(): number {
    return this.collection.length;
  }

  pageCount() {
    return Math.ceil(this.collection.length / this.itemsPerPage);
  }

  pageItemCount(pageIndex: number) {
    if (pageIndex < 0 || pageIndex >= this.pageCount()) return -1;
    if (pageIndex === this.pageCount() - 1)
      return this.itemCount() - this.itemsPerPage * (this.pageCount() - 1);

    return this.itemsPerPage;
  }

  pageIndex(itemIndex: number) {
    if (!this.collection.length || itemIndex < 0 || itemIndex >= this.itemCount()) return -1;
    return Math.floor(itemIndex / this.itemsPerPage);
  }
}
