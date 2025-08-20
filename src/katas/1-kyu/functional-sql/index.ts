// TODO : Implement missing tests

interface QueryInstance<T = unknown, R = T> {
  select<U>(projectionFn?: (item: T) => U): QueryInstance<T, U>;
  from<S>(dataSource: S[]): QueryInstance<S, S>;
  where<U extends T>(...filterPredicates: ((item: T) => boolean)[]): QueryInstance<T, U>;
  groupBy<U extends T>(...keyExtractors: ((item: T) => unknown)[]): QueryInstance<U[], U[]>;
  orderBy(compareFn: (a: R, b: R) => number): QueryInstance<T, R>;
  having<U extends T>(filterPredicate: (group: T) => boolean): QueryInstance<T, U>;
  execute(): R[];
}

export const query = (): QueryInstance => {
  // Prevent duplicate calls for SELECT, GROUP BY, etc.
  let isSelected = false;
  let isGrouped = false;
  let isOrdered = false;

  // Function for projecting/transformation of data (SELECT)
  let projectionFn: ((item: unknown) => unknown) | undefined = undefined;
  // Array of functions for filtering out certain items (WHERE)
  const filterPredicates: ((item: unknown) => boolean)[] = [];
  // Functions for key extraction for grouping (GROUP BY) - can have multiple
  const keyExtractors: ((item: unknown) => unknown)[] = [];
  // Functions for ordering the results (ORDER BY) - can have multiple
  let sortComparator: ((a: unknown, b: unknown) => number) | undefined = undefined;
  // Predicate for filtering groups (HAVING) - not yet implemented
  let havingPredicate: ((group: unknown) => boolean) | undefined = undefined;

  // Data source to process
  let dataSource: unknown[] = [];

  // SELECT : defines how to transform/project the data
  const select = <U>(
    projectionFunction?: (currentItem: unknown) => U,
  ): QueryInstance<unknown, U> => {
    if (isSelected) throw new Error("Duplicate SELECT");

    isSelected = true;
    projectionFn = projectionFunction;

    return queryInstance as QueryInstance<unknown, U>;
  };

  // FROM : defines the data source (original array)
  const from = <S>(sourceArray: S[]): QueryInstance<S, S> => {
    dataSource = sourceArray;
    return queryInstance as QueryInstance<S, S>;
  };

  // WHERE : filters the items based on multiple conditions
  const where = <U>(
    ...filterConditions: ((currentItem: unknown) => boolean)[]
  ): QueryInstance<unknown, U> => {
    filterPredicates.push(...filterConditions);
    return queryInstance as QueryInstance<unknown, U>;
  };

  // GROUP BY : groups the items by multiple keys (like SQL GROUP BY col1, col2)
  const groupBy = <U>(
    ...groupingKeyFns: ((currentItem: unknown) => unknown)[]
  ): QueryInstance<U[], U[]> => {
    if (isGrouped) throw new Error("Duplicate GROUP BY");

    keyExtractors.push(...groupingKeyFns);
    isGrouped = true;

    return queryInstance as QueryInstance<U[], U[]>;
  };

  // ORDER BY : sorts the items based on a comparator function
  const orderBy = <U>(compareFn: (a: unknown, b: unknown) => number): QueryInstance<U, U> => {
    if (isOrdered) throw new Error("Duplicate ORDER BY");

    sortComparator = compareFn;
    isOrdered = true;

    return queryInstance as QueryInstance<U, U>;
  };

  // HAVING : filters groups based on a predicate (like SQL HAVING)
  const having = <U>(filterCondition: (group: unknown) => boolean): QueryInstance<unknown, U> => {
    havingPredicate = filterCondition;
    return queryInstance as QueryInstance<unknown, U>;
  };

  // EXECUTE : processes the data according to the defined operations
  const execute = (): unknown[] => {
    if (!dataSource.length) return [];

    let processedData = dataSource;

    // Apply filter if defined (WHERE)
    if (filterPredicates.length > 0) {
      processedData = processedData.filter((item) =>
        filterPredicates.some((predicate) => predicate(item)),
      );
    }

    // Apply grouping if defined (GROUP BY)
    if (keyExtractors.length > 0) {
      // Create hierarchical grouping for multiple keys
      const groupHierarchically = (
        data: unknown[],
        extractors: ((item: unknown) => unknown)[],
      ): unknown[] => {
        if (extractors.length === 0) return data;

        const [firstExtractor, ...remainingExtractors] = extractors;
        const groupedMap = new Map<unknown, unknown[]>();

        data.forEach((item) => {
          const key = firstExtractor(item);

          if (!groupedMap.has(key)) groupedMap.set(key, []);
          groupedMap.get(key)!.push(item);
        });

        return Array.from(groupedMap.entries()).map(([key, items]) => {
          if (remainingExtractors.length > 0) {
            // Recursively group the remaining levels
            const subGroups = groupHierarchically(items, remainingExtractors);
            return [key, subGroups];
          } else {
            // Leaf level: return [key, items]
            return [key, items];
          }
        });
      };

      processedData = groupHierarchically(processedData, keyExtractors);
    }

    // Apply predicate if defined (HAVING)
    if (havingPredicate && keyExtractors.length > 0)
      processedData = processedData.filter(havingPredicate);

    // Apply projection/transformation if defined (SELECT)
    if (projectionFn) processedData = processedData.map(projectionFn);

    // Apply ordering if defined (ORDER BY)
    if (sortComparator) processedData = processedData.sort(sortComparator);

    return processedData;
  };

  // Instance de l'objet query avec toutes ses méthodes
  const queryInstance: QueryInstance = {
    select,
    from,
    where,
    groupBy,
    orderBy,
    having,
    execute,
  };

  return queryInstance;
};
