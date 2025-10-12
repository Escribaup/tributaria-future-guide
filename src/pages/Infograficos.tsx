import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Timeline data structure - prevents errors and ensures correct content
const timelineData = [
  {
    year: "2025 – Preparação Estratégica",
    bullets: [
      "Último ano antes da transição",
      "📊 Revisar regime tributário e fluxo de caixa",
      "🧾 Diagnosticar créditos acumulados (ICMS, PIS, COFINS)",
      "💻 Treinar equipes e atualizar sistemas fiscais"
    ]
  },
  {
    year: "Até Dez/2025 – Testes e CIB",
    bullets: [
      "Piloto da CBS e Apuração Assistida (jul/25)",
      "🏢 Adaptação ao Cadastro Imobiliário Brasileiro (CIB)"
    ]
  },
  {
    year: "2026 – Ano de Teste (Alíquota 1%)",
    bullets: [
      "🧾 IBS (0,1%) + CBS (0,9%) nas notas fiscais",
      "🏢 DF-e obrigatório para novos setores",
      "💳 Split Payment em fase piloto"
    ]
  },
  {
    year: "2027 – Início da Cobrança Efetiva",
    bullets: [
      "Fim de PIS/COFINS, início da CBS",
      "💰 Split Payment obrigatório",
      "📉 Crédito fiscal só após recolhimento efetivo",
      "🏭 IPI reduzido a zero (exceto Zona Franca de Manaus)",
      "💡 Início do Imposto Seletivo (IS)",
      "📈 Revisar preços, margens e contratos"
    ]
  },
  {
    year: "2029-2032 – Transição Gradual",
    bullets: [
      "Redução progressiva de ICMS/ISS",
      "🚀 Aumento gradual do IBS",
      "💼 Gestão atenta dos créditos e Fundo de Compensação"
    ]
  },
  {
    year: "2033 – Sistema Pleno Implementado",
    bullets: [
      "🧩 Extinção total de ICMS, ISS e IPI",
      "IBS totalmente implementado e não cumulativo",
      "🔍 Primeira avaliação quinquenal da reforma"
    ]
  }
];

// Helper to load images
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!url.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Compose the final infographic with background + content + logos
const composeInfographic = async (backgroundUrl: string): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas dimensions
  canvas.width = 1080;
  canvas.height = 1350;

  try {
    // Load and draw background
    const bgImage = await loadImage(backgroundUrl);
    ctx.drawImage(bgImage, 0, 0, 1080, 1350);

    // Load logo
    const logo = await loadImage('/logo-idvl-white.png');

    // === HEADER SECTION ===
    // Draw semi-transparent overlay for better text readability
    ctx.fillStyle = 'rgba(35, 45, 66, 0.85)';
    ctx.fillRect(0, 0, 1080, 150);

    // Draw header logo (top-left)
    ctx.drawImage(logo, 40, 40, 200, 60);

    // Title
    ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Reforma Tributária:', 540, 60);
    ctx.fillText('Linha do Tempo 2025-2033', 540, 100);

    // Subtitle
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Prepare sua empresa para a transformação total', 540, 130);

    // === TIMELINE SECTION ===
    const timelineX = 540;
    const startY = 200;
    const cardWidth = 480;
    const cardHeight = 140;
    const verticalSpacing = 170;

    // Draw vertical timeline spine
    ctx.strokeStyle = '#1e6efb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(timelineX, 160);
    ctx.lineTo(timelineX, 1230);
    ctx.stroke();

    // Draw timeline cards
    timelineData.forEach((item, index) => {
      const y = startY + (index * verticalSpacing);
      const isLeft = index % 2 === 0;
      const cardX = isLeft ? timelineX - cardWidth - 30 : timelineX + 30;

      // Draw connector dot
      ctx.fillStyle = '#1e6efb';
      ctx.beginPath();
      ctx.arc(timelineX, y + 40, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw card background
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.roundRect(cardX, y, cardWidth, cardHeight, 12);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Draw card title
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#0b1a37';
      ctx.textAlign = 'left';
      ctx.fillText(item.year, cardX + 20, y + 35);

      // Draw bullets
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#334155';
      let bulletY = y + 60;
      item.bullets.forEach((bullet) => {
        if (bulletY < y + cardHeight - 15) {
          const bulletText = bullet.length > 60 ? bullet.substring(0, 57) + '...' : bullet;
          ctx.fillText(bulletText, cardX + 20, bulletY);
          bulletY += 22;
        }
      });
    });

    // === FOOTER SECTION ===
    // Draw footer background
    ctx.fillStyle = '#1a2335';
    ctx.fillRect(0, 1230, 1080, 120);

    // Draw footer logo (bottom-right)
    ctx.drawImage(logo, 1080 - 140, 1350 - 70, 100, 30);

    // CTA text
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Acesse o Simulador e Assistente IA', 540, 1270);

    // URL
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#1e6efb';
    ctx.fillText('https://reforma.idvl.com.br/', 540, 1310);

    // Convert to PNG
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error composing infographic:', error);
    throw error;
  }
};

const Infograficos = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const handleGenerateBackground = async () => {
    setIsGeneratingBg(true);
    setBackgroundImage(null);
    setGeneratedImage(null);

    try {
      toast.loading("Gerando fundo com IA...", { id: "bg-gen" });
      
      const { data, error } = await supabase.functions.invoke("generate-infographic-bg");

      if (error) throw error;

      if (data?.imageUrl) {
        setBackgroundImage(data.imageUrl);
        toast.success("Fundo gerado! Agora monte o infográfico final.", { id: "bg-gen" });
      } else {
        throw new Error("Nenhuma imagem de fundo foi gerada");
      }
    } catch (error: any) {
      console.error("Error generating background:", error);
      toast.error(
        error.message || "Não foi possível gerar o fundo. Tente novamente.",
        { id: "bg-gen" }
      );
    } finally {
      setIsGeneratingBg(false);
    }
  };

  const handleComposeInfographic = async () => {
    if (!backgroundImage) {
      toast.error("Gere o fundo primeiro!");
      return;
    }

    setIsComposing(true);

    try {
      toast.loading("Compondo infográfico com conteúdo e logos...", { id: "compose" });
      
      const finalImage = await composeInfographic(backgroundImage);
      setGeneratedImage(finalImage);
      
      toast.success("Infográfico pronto para download!", { id: "compose" });
    } catch (error: any) {
      console.error("Error composing infographic:", error);
      toast.error(
        error.message || "Não foi possível compor o infográfico. Tente novamente.",
        { id: "compose" }
      );
    } finally {
      setIsComposing(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `infografico-reforma-tributaria-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download iniciado!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Gerador de Infográficos
            </h1>
            <p className="text-muted-foreground">
              Crie infográficos profissionais sobre a Reforma Tributária com IA
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Geração do Infográfico</CardTitle>
                <CardDescription>
                  Processo em 2 etapas: primeiro gera o fundo, depois monta o conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleGenerateBackground}
                    disabled={isGeneratingBg || isComposing}
                    className="flex-1"
                    size="lg"
                  >
                    {isGeneratingBg ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando fundo...
                      </>
                    ) : (
                      "1. Gerar Fundo com IA"
                    )}
                  </Button>

                  <Button 
                    onClick={handleComposeInfographic}
                    disabled={!backgroundImage || isGeneratingBg || isComposing}
                    className="flex-1"
                    size="lg"
                    variant="secondary"
                  >
                    {isComposing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Montando...
                      </>
                    ) : (
                      "2. Montar Infográfico Final"
                    )}
                  </Button>
                </div>

                {backgroundImage && !generatedImage && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      ✅ Fundo gerado! Clique em "Montar Infográfico Final" para adicionar conteúdo e logos.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Visualize e baixe o infográfico gerado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(isGeneratingBg || isComposing) ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      {isGeneratingBg ? "Gerando fundo com IA..." : "Compondo infográfico com conteúdo e logos..."}
                    </p>
                  </div>
                ) : generatedImage ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden bg-muted">
                      <img
                        src={generatedImage}
                        alt="Infográfico gerado"
                        className="w-full h-auto"
                      />
                    </div>
                    
                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      variant="default"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Infográfico (PNG 1080x1350)
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="text-6xl">🎨</div>
                    <p className="text-muted-foreground text-center">
                      Nenhum infográfico gerado ainda
                    </p>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      Clique em "Gerar Fundo com IA" para começar. Depois monte o infográfico com conteúdo e logos.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Infograficos;
