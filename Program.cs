using System;
using System.Collections.Generic;

namespace dotnet
{
    class Program
    {
        // Viết hoa chữ M ở hàm Main
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("==================================================");
            Console.WriteLine("    CHƯƠNG TRÌNH THỰC HÀNH C# CƠ BẢN (CÁC KIỂU DỮ LIỆU & MẢNG)");
            Console.WriteLine("==================================================\n");

            // ----------------------------------------------------
            // 1. KIỂU DỮ LIỆU CƠ BẢN & CHUỖI (String Interpolation)
            // ----------------------------------------------------
            string courseName = "Lập trình C# cho Java Developer";
            int totalModules = 5;
            decimal price = 0.00m; // Kiểu decimal cho tiền tệ/tài chính (hậu tố m)
            bool isFree = true;

            Console.WriteLine($"[1] THÔNG TIN KHÓA HỌC:");
            Console.WriteLine($"Khóa học: {courseName}");
            Console.WriteLine($"Số phần: {totalModules} bài học | Học phí: {price} VNĐ (Miễn phí: {isFree})\n");

            // ----------------------------------------------------
            // 2. MẢNG 1 CHIỀU (Array) & VÒNG LẶP (for, foreach)
            // ----------------------------------------------------
            Console.WriteLine("[2] THỰC HÀNH MẢNG 1 CHIỀU (Danh sách điểm):");
            double[] scores = { 8.5, 9.0, 7.5, 10.0, 6.8 };

            Console.Write("Danh sách điểm gốc: ");
            foreach (double score in scores)
            {
                Console.Write($"{score}  ");
            }
            Console.WriteLine();

            // Tính trung bình cộng điểm số
            double sum = 0;
            for (int i = 0; i < scores.Length; i++)
            {
                sum += scores[i];
            }
            double average = sum / scores.Length;
            Console.WriteLine($"-> Điểm trung bình: {average:F2}\n"); // :F2 để format lấy 2 chữ số thập phân

            // ----------------------------------------------------
            // 3. MẢNG 2 CHIỀU (Rectangular Array [,] - Đặc trưng C#)
            // ----------------------------------------------------
            Console.WriteLine("[3] THỰC HÀNH MẢNG 2 CHIỀU (Bảng tọa độ 3x3):");
            int[,] matrix = new int[3, 3] {
                { 1, 2, 3 },
                { 4, 5, 6 },
                { 7, 8, 9 }
            };

            for (int row = 0; row < matrix.GetLength(0); row++)
            {
                for (int col = 0; col < matrix.GetLength(1); col++)
                {
                    Console.Write($"{matrix[row, col]}  ");
                }
                Console.WriteLine();
            }
            Console.WriteLine();

            // ----------------------------------------------------
            // 4. COLLECTION: List<T> (Tương đương ArrayList trong Java)
            // ----------------------------------------------------
            Console.WriteLine("[4] THỰC HÀNH LIST (Danh sách ngôn ngữ cần học):");
            List<string> languages = new List<string>();
            languages.Add("Java");
            languages.Add("C#");
            languages.Add("SQL");
            languages.Add("Python");

            // Xóa phần tử
            languages.Remove("Python");

            Console.WriteLine($"Số lượng ngôn ngữ: {languages.Count}");
            for (int i = 0; i < languages.Count; i++)
            {
                Console.WriteLine($"  {i + 1}. {languages[i]}");
            }
            Console.WriteLine();

            // ----------------------------------------------------
            // 5. COLLECTION: Dictionary<K, V> (Tương đương HashMap)
            // ----------------------------------------------------
            Console.WriteLine("[5] THỰC HÀNH DICTIONARY (Quản lý điểm theo tên):");
            Dictionary<string, double> studentScores = new Dictionary<string, double>();
            studentScores["Minh Hiếu"] = 9.5;
            studentScores["An"] = 8.0;
            studentScores["Bình"] = 7.0;

            foreach (KeyValuePair<string, double> item in studentScores)
            {
                string rank = item.Value >= 8.0 ? "Giỏi" : "Khá"; // Toán tử 3 ngôi
                Console.WriteLine($"Học viên: {item.Key,-10} | Điểm: {item.Value} | Xếp loại: {rank}");
            }

            Console.WriteLine("\n==================================================");
            Console.WriteLine("    HOÀN THÀNH BÀI CHẠY THỬ! BẤM PHÍM BẤT KỲ ĐỂ THOÁT.");
            Console.WriteLine("==================================================");
            Console.ReadKey();
        }
    }
}