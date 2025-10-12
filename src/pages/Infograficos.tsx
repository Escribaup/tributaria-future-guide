import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Image as ImageIcon } from "lucide-react";

const DEFAULT_PROMPT = `Create a professional vertical infographic (1080x1350px) for social media about Brazil's Tax Reform Timeline.

IMPORTANT INSTRUCTIONS:
- DO NOT create or draw any logos
- Leave a WHITE RECTANGULAR SPACE (200x60px) at top-left of header for logo placement
- Leave a WHITE RECTANGULAR SPACE (100x30px) at bottom-right of footer for logo placement
- Each year should appear ONLY ONCE in the timeline
- Use clear, professional typography

HEADER SECTION (top 150px):
- Reserved logo space: 200x60px white rectangle at top-left
- Title: "Reforma Tributária: Linha do Tempo 2025-2033"
- Subtitle: "Prepare sua empresa para a transformação total"

BACKGROUND:
- Subtle gradient: #232d42 (top) to #1e6efb (bottom)
- Clean, professional, corporate style
- Sufficient contrast for text readability

TIMELINE (vertical structure with connecting line in #1e6efb):

📅 2025 – Preparação Estratégica
• Último ano antes da transição
• 📊 Revisar regime tributário e fluxo de caixa
• 🧾 Diagnosticar créditos acumulados (ICMS, PIS, COFINS)
• 💻 Treinar equipes e atualizar sistemas fiscais

🧪 Até Dez/2025 – Testes e CIB
• Piloto da CBS e Apuração Assistida (jul/25)
• 🏢 Adaptação ao Cadastro Imobiliário Brasileiro (CIB)

💡 2026 – Ano de Teste (Alíquota 1%)
• 🧾 IBS (0,1%) + CBS (0,9%) nas notas fiscais
• 🏢 DF-e obrigatório para novos setores
• 💳 Split Payment em fase piloto

⚙️ 2027 – Início da Cobrança Efetiva
• Fim de PIS/COFINS, início da CBS
• 💰 Split Payment obrigatório
• 📉 Crédito fiscal só após recolhimento efetivo
• 🏭 IPI reduzido a zero (exceto Zona Franca de Manaus)
• 💡 Início do Imposto Seletivo (IS)
• 📈 Revisar preços, margens e contratos

📊 2029-2032 – Transição Gradual
• Redução progressiva de ICMS/ISS
• 🚀 Aumento gradual do IBS
• 💼 Gestão atenta dos créditos e Fundo de Compensação

🏛️ 2033 – Sistema Pleno Implementado
• 🧩 Extinção total de ICMS, ISS e IPI
• IBS totalmente implementado e não cumulativo
• 🔍 Primeira avaliação quinquenal da reforma

FOOTER SECTION (bottom 100px):
- Background: slightly darker shade (#1a2335)
- Bold CTA text: "Acesse o Simulador e Assistente IA"
- URL: "https://reforma.idvl.com.br/" (large, clear font)
- Reserved logo space: 100x30px white rectangle at bottom-right

STYLE GUIDELINES:
- Typography: Montserrat Bold for headings, Open Sans for body text
- Cards/sections: white/light gray (#f2f2f2) with subtle shadows
- Icons: bright blue (#1e6efb) for visual consistency
- High contrast for readability on mobile devices
- Modern, clean, minimalist corporate aesthetic
- Professional color balance throughout`;

const composeWithLogo = async (generatedImageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Carregar a imagem gerada pela IA
    const aiImage = new Image();
    aiImage.crossOrigin = 'anonymous';
    
    aiImage.onload = () => {
      // Configurar canvas com as dimensões da imagem
      canvas.width = aiImage.width;
      canvas.height = aiImage.height;
      
      // Desenhar a imagem base
      ctx.drawImage(aiImage, 0, 0);
      
      // Carregar e sobrepor a logo no header
      const logoHeader = new Image();
      logoHeader.onload = () => {
        // Posicionar logo no header (top-left com margem)
        const headerLogoWidth = 200;
        const headerLogoHeight = 60;
        const headerX = 40; // margem esquerda
        const headerY = 40; // margem superior
        
        ctx.drawImage(logoHeader, headerX, headerY, headerLogoWidth, headerLogoHeight);
        
        // Carregar e sobrepor a logo no footer
        const logoFooter = new Image();
        logoFooter.onload = () => {
          // Posicionar logo no footer (bottom-right com margem)
          const footerLogoWidth = 100;
          const footerLogoHeight = 30;
          const footerX = canvas.width - footerLogoWidth - 40; // margem direita
          const footerY = canvas.height - footerLogoHeight - 40; // margem inferior
          
          ctx.drawImage(logoFooter, footerX, footerY, footerLogoWidth, footerLogoHeight);
          
          // Converter canvas para data URL
          const finalImage = canvas.toDataURL('image/png', 1.0);
          resolve(finalImage);
        };
        
        logoFooter.onerror = () => reject(new Error('Failed to load footer logo'));
        logoFooter.src = '/logo-idvl-white.png';
      };
      
      logoHeader.onerror = () => reject(new Error('Failed to load header logo'));
      logoHeader.src = '/logo-idvl-white.png';
    };
    
    aiImage.onerror = () => reject(new Error('Failed to load AI generated image'));
    aiImage.src = generatedImageUrl;
  });
};

const Infograficos = () => {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um prompt para gerar o infográfico",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Passo 1: Gerar infográfico com IA
      const { data, error } = await supabase.functions.invoke("generate-infographic", {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        // Passo 2: Compor com logo real
        toast({
          title: "Processando...",
          description: "Adicionando logo IDVL ao infográfico",
        });
        
        const finalImage = await composeWithLogo(data.imageUrl);
        setGeneratedImage(finalImage);
        
        toast({
          title: "Sucesso!",
          description: "Infográfico gerado e composto com logo IDVL",
        });
      } else {
        throw new Error("Nenhuma imagem foi gerada");
      }
    } catch (error) {
      console.error("Error generating infographic:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o infográfico. Tente novamente.",
        variant: "destructive",
      });
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

    toast({
      title: "Download iniciado",
      description: "O infográfico está sendo baixado",
    });
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
            {/* Editor de Prompt */}
            <Card>
              <CardHeader>
                <CardTitle>Prompt de Geração</CardTitle>
                <CardDescription>
                  Personalize o prompt para gerar diferentes variações do infográfico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Insira o prompt para gerar o infográfico..."
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Gerar Infográfico
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setPrompt(DEFAULT_PROMPT)}
                  >
                    Resetar
                  </Button>
                </div>
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
                  <div className="flex flex-col items-center justify-center h-96 bg-muted rounded-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Gerando infográfico...</p>
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
                      Baixar Infográfico
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 bg-muted rounded-lg">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum infográfico gerado ainda
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Clique em "Gerar Infográfico" para começar
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
