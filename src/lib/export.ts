import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { COMPANY_NAME } from "@/lib/constants";
import { formatDualCurrency, formatDate } from "@/lib/utils-format";

interface ReportExpense {
  title: string;
  amount: number;
  date: Date | string;
  category: { name: string };
  paymentMethod: string;
}

interface ReportData {
  month: number;
  year: number;
  total: number;
  breakdown: { name: string; total: number }[];
  highest: { name: string; total: number } | null;
  prevMonthTotal: number;
  comparison: number;
  expenses: ReportExpense[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function exportToPDF(report: ReportData) {
  const doc = new jsPDF();
  const monthName = MONTHS[report.month - 1];

  doc.setFontSize(20);
  doc.text(COMPANY_NAME, 14, 20);
  doc.setFontSize(14);
  doc.text(`Monthly Expense Report - ${monthName} ${report.year}`, 14, 30);

  doc.setFontSize(11);
  doc.text(`Total Expenses: ${formatDualCurrency(report.total, "PKR")}`, 14, 42);
  doc.text(`Previous Month: ${formatDualCurrency(report.prevMonthTotal, "PKR")}`, 14, 50);
  doc.text(
    `Change: ${report.comparison >= 0 ? "+" : ""}${report.comparison.toFixed(1)}%`,
    14,
    58
  );
  if (report.highest) {
    doc.text(`Highest Category: ${report.highest.name} (${formatDualCurrency(report.highest.total, "PKR")})`, 14, 66);
  }

  autoTable(doc, {
    startY: 75,
    head: [["Category", "Amount"]],
    body: report.breakdown.map((b) => [b.name, formatDualCurrency(b.total, "PKR")]),
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  autoTable(doc, {
    startY: finalY,
    head: [["Date", "Title", "Category", "Payment", "Amount"]],
    body: report.expenses.map((e) => [
      formatDate(e.date),
      e.title,
      e.category.name,
      e.paymentMethod,
      formatDualCurrency(e.amount, (e as { currency?: "PKR" | "CLP" }).currency ?? "PKR"),
    ]),
  });

  doc.save(`expense-report-${monthName}-${report.year}.pdf`);
}

export function exportToExcel(report: ReportData) {
  const monthName = MONTHS[report.month - 1];
  const wb = XLSX.utils.book_new();

  const summary = [
    ["Company", COMPANY_NAME],
    ["Report Period", `${monthName} ${report.year}`],
    ["Total Expenses", report.total],
    ["Previous Month", report.prevMonthTotal],
    ["Change %", report.comparison],
    ["Highest Category", report.highest?.name ?? "N/A"],
    ["Highest Amount", report.highest?.total ?? 0],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const breakdownSheet = XLSX.utils.json_to_sheet(
    report.breakdown.map((b) => ({ Category: b.name, Amount: b.total }))
  );
  XLSX.utils.book_append_sheet(wb, breakdownSheet, "Categories");

  const expensesSheet = XLSX.utils.json_to_sheet(
    report.expenses.map((e) => ({
      Date: formatDate(e.date),
      Title: e.title,
      Category: e.category.name,
      Payment: e.paymentMethod,
      Amount: e.amount,
    }))
  );
  XLSX.utils.book_append_sheet(wb, expensesSheet, "Expenses");

  XLSX.writeFile(wb, `expense-report-${monthName}-${report.year}.xlsx`);
}
