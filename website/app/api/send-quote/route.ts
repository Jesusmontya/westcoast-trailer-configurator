import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { toEmail, clientName, quoteNumber, pdfBase64 } = await req.json();

    if (!toEmail || !pdfBase64) {
      return Response.json({ error: "Faltan datos" }, { status: 400 });
    }

    // pdfBase64 llega como data URL ("data:application/pdf;base64,...."),
    // le quitamos el encabezado para quedarnos solo con el contenido
    const base64Content = pdfBase64.split(",")[1] || pdfBase64;

    await transporter.sendMail({
      from: `"All Custom Trailers" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Your Quote #${quoteNumber} — All Custom Trailers`,
      html: `
        <p>Hi ${clientName || "there"},</p>
        <p>Attached is your custom trailer quote #${quoteNumber}. This quote is valid for 30 days.</p>
        <p>Questions? Just reply to this email or give us a call.</p>
        <p>— All Custom Trailers</p>
      `,
      attachments: [
        {
          filename: `quote-${quoteNumber}.pdf`,
          content: base64Content,
          encoding: "base64",
        },
      ],
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "No se pudo enviar el correo" }, { status: 500 });
  }
}