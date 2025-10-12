import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TimelineEditor } from "@/components/infograficos/TimelineEditor";

// Color palette for modern design
const COLORS = {
  primary: '#1e6efb',
  darkBlue: '#232d42',
  footerBg: '#1a2335',
  accentBlue: '#3b82f6',
  lightBlue: '#60a5fa',
  urlHighlight: '#38bdf8', // Cyan vibrante para URL (melhor contraste)
  cardBg: '#ffffff',
  cardShadow: 'rgba(0, 0, 0, 0.12)',
  textPrimary: '#0b1a37',
  textSecondary: '#334155',
  textMuted: '#64748b'
};

// Default timeline data structure
type TimelineItem = {
  year: string;
  bullets: string[];
};
const DEFAULT_TIMELINE_DATA = [
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

// Helper to draw image with aspect ratio preserved
const drawImageWithAspectRatio = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
) => {
  const imgAspect = image.width / image.height;
  const maxAspect = maxWidth / maxHeight;
  
  let drawWidth = maxWidth;
  let drawHeight = maxHeight;
  
  if (imgAspect > maxAspect) {
    // Image is wider - fit by width
    drawHeight = maxWidth / imgAspect;
  } else {
    // Image is taller - fit by height
    drawWidth = maxHeight * imgAspect;
  }
  
  // Center within available space
  const drawX = x + (maxWidth - drawWidth) / 2;
  const drawY = y + (maxHeight - drawHeight) / 2;
  
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
};

// Background drawing functions
const drawCleanGradient = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 1350);
  gradient.addColorStop(0, COLORS.darkBlue);
  gradient.addColorStop(0.5, '#1a4d8f');
  gradient.addColorStop(1, COLORS.primary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1350);
};

const drawGeometricBackground = (ctx: CanvasRenderingContext2D, showDecorations: boolean) => {
  drawCleanGradient(ctx);
  
  if (!showDecorations) return;
  
  // Círculos decorativos
  const circles = [
    { x: 200, y: 300, r: 150, alpha: 0.08 },
    { x: 900, y: 700, r: 200, alpha: 0.06 },
    { x: 100, y: 1100, r: 120, alpha: 0.1 }
  ];
  
  circles.forEach(c => {
    ctx.fillStyle = `rgba(255, 255, 255, ${c.alpha})`;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Linhas diagonais
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(-200 + i * 300, 0);
    ctx.lineTo(400 + i * 300, 1350);
    ctx.stroke();
  }
};

const drawDataLinesBackground = (ctx: CanvasRenderingContext2D, showDecorations: boolean) => {
  drawCleanGradient(ctx);
  
  if (!showDecorations) return;
  
  // Barras verticais estilizadas
  for (let i = 0; i < 20; i++) {
    const x = 50 + i * 50;
    const height = 100 + Math.random() * 400;
    const y = 1200 - height;
    
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.03)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, 30, height);
  }
};

const drawAbstractBackground = (ctx: CanvasRenderingContext2D, showDecorations: boolean) => {
  drawCleanGradient(ctx);
  
  if (!showDecorations) return;
  
  // Curvas suaves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 3;
  
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 200 + i * 300);
    ctx.bezierCurveTo(
      300, 100 + i * 300,
      700, 300 + i * 300,
      1080, 200 + i * 300
    );
    ctx.stroke();
  }
};

// Generate complete infographic programmatically
const generateInfographic = async (
  timelineData: TimelineItem[],
  backgroundStyle: 'clean' | 'geometric' | 'data' | 'abstract',
  showDecorations: boolean
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = 1080;
  canvas.height = 1350;

  try {
    // 1. Draw background based on style
    switch (backgroundStyle) {
      case 'clean':
        drawCleanGradient(ctx);
        break;
      case 'geometric':
        drawGeometricBackground(ctx, showDecorations);
        break;
      case 'data':
        drawDataLinesBackground(ctx, showDecorations);
        break;
      case 'abstract':
        drawAbstractBackground(ctx, showDecorations);
        break;
    }

    // 2. Load logo
    const logo = await loadImage('/logo-idvl-white.png');

    // 3. HEADER SECTION
    ctx.fillStyle = 'rgba(35, 45, 66, 0.92)';
    ctx.fillRect(0, 0, 1080, 150);

    drawImageWithAspectRatio(ctx, logo, 40, 40, 200, 60);

    // Title with shadow for depth
    ctx.font = '900 44px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillText('Reforma Tributária:', 540, 60);
    ctx.fillText('Linha do Tempo 2025-2033', 540, 100);
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Subtitle
    ctx.font = '600 20px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Prepare sua empresa para a transformação total', 540, 130);

    // 4. TIMELINE SECTION
    const timelineX = 540;
    const startY = 200;
    const cardWidth = 480;
    const cardHeight = 140;
    const verticalSpacing = 170;

    // Draw vertical timeline spine with gradient
    const spineGradient = ctx.createLinearGradient(0, 160, 0, 1230);
    spineGradient.addColorStop(0, COLORS.primary);
    spineGradient.addColorStop(0.5, COLORS.accentBlue);
    spineGradient.addColorStop(1, COLORS.lightBlue);
    ctx.strokeStyle = spineGradient;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(timelineX, 160);
    ctx.lineTo(timelineX, 1230);
    ctx.stroke();

    // Draw timeline cards
    timelineData.forEach((item, index) => {
      const y = startY + (index * verticalSpacing);
      const isLeft = index % 2 === 0;
      const cardX = isLeft ? timelineX - cardWidth - 30 : timelineX + 30;

      // Draw connector dot with glow
      ctx.fillStyle = COLORS.primary;
      ctx.shadowColor = COLORS.primary;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(timelineX, y + 40, 16, 0, Math.PI * 2);
      ctx.fill();
      
      // Outer ring
      ctx.strokeStyle = COLORS.lightBlue;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(timelineX, y + 40, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Draw card with mini border on top
      ctx.fillStyle = COLORS.primary;
      ctx.fillRect(cardX, y, cardWidth, 4);
      
      ctx.fillStyle = COLORS.cardBg;
      ctx.shadowColor = COLORS.cardShadow;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 6;
      ctx.beginPath();
      ctx.roundRect(cardX, y + 4, cardWidth, cardHeight - 4, [0, 0, 16, 16]);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Card title
      ctx.font = '900 23px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = COLORS.textPrimary;
      ctx.textAlign = 'left';
      ctx.fillText(item.year, cardX + 20, y + 38);

      // Bullets
      ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = COLORS.textSecondary;
      let bulletY = y + 62;
      item.bullets.forEach((bullet) => {
        if (bulletY < y + cardHeight - 10) {
          const bulletText = bullet.length > 60 ? bullet.substring(0, 57) + '...' : bullet;
          ctx.fillText(bulletText, cardX + 20, bulletY);
          bulletY += 22;
        }
      });
    });

    // 5. FOOTER SECTION
    ctx.fillStyle = COLORS.footerBg;
    ctx.fillRect(0, 1230, 1080, 120);

    drawImageWithAspectRatio(ctx, logo, 1080 - 140, 1350 - 70, 100, 30);

    // CTA text
    ctx.font = '900 26px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Acesse o Simulador e Assistente IA', 540, 1270);

    // URL with cyan highlight and glow
    ctx.font = '900 30px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = COLORS.urlHighlight;
    ctx.shadowColor = COLORS.urlHighlight;
    ctx.shadowBlur = 15;
    ctx.fillText('https://reforma.idvl.com.br/', 540, 1312);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Convert to PNG
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error composing infographic:', error);
    throw error;
  }
};

const Infograficos = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Design controls
  const [backgroundStyle, setBackgroundStyle] = useState<'clean' | 'geometric' | 'data' | 'abstract'>('geometric');
  const [showDecorations, setShowDecorations] = useState(true);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(DEFAULT_TIMELINE_DATA);

  const handleGenerateInfographic = async () => {
    // Validate timeline items
    const hasEmptyYears = timelineItems.some(item => !item.year.trim());
    if (hasEmptyYears) {
      toast.error("Por favor, preencha todos os títulos dos períodos da timeline");
      return;
    }

    setIsGenerating(true);

    try {
      toast.loading("Gerando infográfico...", { id: "generate" });
      
      const finalImage = await generateInfographic(timelineItems, backgroundStyle, showDecorations);
      setGeneratedImage(finalImage);
      
      toast.success("Infográfico pronto para download!", { id: "generate" });
    } catch (error: any) {
      console.error("Error generating infographic:", error);
      toast.error(
        error.message || "Não foi possível gerar o infográfico. Tente novamente.",
        { id: "generate" }
      );
    } finally {
      setIsGenerating(false);
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
                <CardTitle>Configuração do Infográfico</CardTitle>
                <CardDescription>
                  Customize o design e conteúdo do seu infográfico profissional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Estilo de Fundo */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estilo de Fundo</label>
                  <Select value={backgroundStyle} onValueChange={(v: any) => setBackgroundStyle(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean">Gradiente Limpo</SelectItem>
                      <SelectItem value="geometric">Elementos Geométricos</SelectItem>
                      <SelectItem value="data">Linhas de Dados</SelectItem>
                      <SelectItem value="abstract">Abstrato Corporativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Toggle Decorações */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Elementos Decorativos</label>
                  <Switch checked={showDecorations} onCheckedChange={setShowDecorations} />
                </div>

                {/* Editor de Conteúdo da Timeline */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Conteúdo da Timeline
                  </label>
                  <TimelineEditor
                    items={timelineItems}
                    onChange={setTimelineItems}
                  />
                </div>

                <Button 
                  onClick={handleGenerateInfographic}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Infográfico"
                  )}
                </Button>
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
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Gerando seu infográfico...
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
                      Configure o design e clique em "Gerar Infográfico" para criar sua visualização profissional instantaneamente.
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
