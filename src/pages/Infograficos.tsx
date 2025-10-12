import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Image as ImageIcon } from "lucide-react";

const DEFAULT_PROMPT = `Create a professional vertical infographic (1080x1350px) with IDVL brand identity:

HEADER:
- IDVL logo (navy blue #232d42 with bright blue #1e6efb accent on 'i')
- Title: "Reforma Tributária: Linha do Tempo 2025-2033"
- Subtitle: "Prepare sua empresa para a transformação"

BACKGROUND:
- Subtle gradient from #232d42 (top) to #1e6efb (bottom)
- Clean, professional, corporate style

TIMELINE (vertical line in #1e6efb connecting all sections):

2025 - Preparação Estratégica
• 📊 Revisar regime e fluxo de caixa
• 🧾 Diagnosticar créditos acumulados  
• 💻 Atualizar sistemas fiscais

2026 - Ano de Teste (1%)
• 🧾 IBS 0,1% + CBS 0,9%
• 🏢 DF-e obrigatório
• 💳 Split Payment piloto

2027 - Cobrança Efetiva
• ⚙️ CBS substitui PIS/COFINS
• 💰 Split Payment obrigatório
• 🏭 IPI zerado (exceto ZFM)
• 💡 Imposto Seletivo

2029-2032 - Transição
• 📊 Redução ICMS/ISS
• 🚀 Aumento IBS
• 💼 Gestão de créditos

2033 - Sistema Pleno
• 🧩 Extinção ICMS/ISS/IPI
• 🏛️ IBS 100% implementado
• 🔍 Avaliação quinquenal

FOOTER:
- Bold CTA: "Acesse o Simulador e Assistente IA"
- "reformatributaria.idvl.com.br"
- Small IDVL logo

STYLE:
- Font: Montserrat Bold for titles, Open Sans for text
- Cards: white/light gray (#f2f2f2) with subtle shadows
- Icons: bright blue (#1e6efb)
- Professional, clean, corporate design
- High contrast for readability
- Modern minimalist aesthetic`;

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
      const { data, error } = await supabase.functions.invoke("generate-infographic", {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast({
          title: "Sucesso!",
          description: "Infográfico gerado com sucesso",
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
