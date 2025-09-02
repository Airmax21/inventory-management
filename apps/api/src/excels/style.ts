import ExcelJS, { Worksheet } from 'exceljs';

export type HeaderStyleOptions = {
    headerRow?: number;
    fontColor?: string;
    fillColor?: string;
};

export function styleHeader(
    worksheet: Worksheet,
    opts: HeaderStyleOptions = {}
): void {
    const {
        headerRow = 1,
        fontColor = 'FFFFFFFF',
        fillColor = '4472C4',
    } = opts;

    const row = worksheet.getRow(headerRow);
    row.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: fontColor } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });


    row.height = row.height ?? 20;
}

/** Terapkan ke banyak worksheet sekaligus */
export function styleHeaderForAll(
    sheets: Worksheet[],
    opts?: HeaderStyleOptions
): void {
    for (const ws of sheets) styleHeader(ws, opts);
}
