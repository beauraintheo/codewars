const getDeterminant2x2Matrix = (matrix: number[][]) => {
  if (matrix.length !== 2 || matrix[0].length !== 2) throw new Error("Not an 2x2 square matrix");

  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};

export const determinant = (m: number[][]): number => {
  if (m.length !== m[0].length) throw new Error("Not an square matrix");

  if (m.length === 1) return m[0][0];
  if (m.length === 2) return getDeterminant2x2Matrix(m);

  const determinants: number[] = m[0].map((matrixValue, index) => {
    const slicedMatrix = m.slice(1).map((col) => col.filter((_, j) => j !== index));

    if (slicedMatrix.length === 2) return matrixValue * getDeterminant2x2Matrix(slicedMatrix);
    return matrixValue * determinant(slicedMatrix);
  });

  return determinants.reduce((acc, curr, index) => (index % 2 === 0 ? acc + curr : acc - curr), 0);
};
