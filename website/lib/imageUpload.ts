import { supabase } from "./supabase";

/**
 * Redimensiona y comprime una imagen en el navegador antes de subirla,
 * para que el catálogo y los PDFs no carguen fotos pesadas.
 */
function compressImage(file: File, maxWidth = 900, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No se pudo procesar la imagen"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo comprimir"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;

    reader.readAsDataURL(file);
  });
}

/**
 * Comprime y sube una imagen al bucket "catalog" de Supabase Storage.
 * Regresa la URL pública lista para usar en <img> o en el PDF.
 */
export async function uploadCatalogImage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const { error } = await supabase.storage.from("catalog").upload(fileName, compressed, {
    contentType: "image/jpeg",
  });

  if (error) throw error;

  const { data } = supabase.storage.from("catalog").getPublicUrl(fileName);
  return data.publicUrl;
}