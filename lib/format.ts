// Fungsi formatPrice digunakan untuk mengubah nilai harga menjadi format mata uang yang sesuai.
export const formatPrice = (price: number) => {
  // Membuat objek baru dari kelas Intl.NumberFormat dengan konfigurasi format mata uang.
  // Dalam kasus ini, format mata uang yang digunakan adalah USD (Dolar Amerika).
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Gaya format: mata uang.
    currency: "USD", // Mata uang: Dolar Amerika.
  }).format(price); // Mengembalikan nilai harga yang diformat dalam format mata uang yang sesuai.
};
