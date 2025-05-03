
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import GerenciarProdutos from "@/components/admin/GerenciarProdutos";
import GerenciarFornecedores from "@/components/admin/GerenciarFornecedores";
import GerenciarAliquotas from "@/components/admin/GerenciarAliquotas";

const Admin = () => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-idvl-blue-dark text-white p-4 shadow-md">
        <div className="container-custom flex justify-between items-center">
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <span>{user?.email}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
              className="text-white border-white hover:bg-white hover:text-idvl-blue-dark"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-6">
        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="homepage">Página Inicial</TabsTrigger>
            <TabsTrigger value="features">Recursos</TabsTrigger>
            <TabsTrigger value="simulador">Simulador</TabsTrigger>
          </TabsList>
          
          <TabsContent value="homepage" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Conteúdos da Página Inicial</h2>
              <HomepageContentEditor />
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Gerenciar Recursos</h2>
              <FeaturesEditor />
            </div>
          </TabsContent>
          
          <TabsContent value="simulador" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <GerenciarProdutos />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <GerenciarFornecedores />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <GerenciarAliquotas />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const HomepageContentEditor = () => {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchContents();
  }, []);
  
  const fetchContents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('section');
        
      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar conteúdos",
        description: "Não foi possível carregar os conteúdos da página inicial.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateContent = async (id: string, title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({ 
          title, 
          content,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Conteúdo atualizado",
        description: "O conteúdo foi atualizado com sucesso.",
      });
      
      fetchContents();
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o conteúdo.",
      });
    }
  };
  
  const { user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-idvl-blue-dark"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {contents.map((item) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg capitalize">{item.section}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{item.title}</p>
                </div>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Editar {item.section}</DialogTitle>
            </DialogHeader>
            <EditContentForm 
              content={item} 
              onSave={(title, content) => updateContent(item.id, title, content)} 
            />
          </DialogContent>
        </Dialog>
      ))}
      
      {contents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum conteúdo encontrado.
        </div>
      )}
    </div>
  );
};

const EditContentForm = ({ content, onSave }: { content: any, onSave: (title: string, content: string) => void }) => {
  const [title, setTitle] = useState(content.title);
  const [contentText, setContentText] = useState(content.content);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(title, contentText);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          placeholder="Conteúdo"
          rows={5}
          required
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-idvl-blue-dark hover:bg-idvl-blue-light"
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
};

const FeaturesEditor = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFeatures();
  }, []);
  
  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('order_number');
        
      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Erro ao buscar recursos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar recursos",
        description: "Não foi possível carregar os recursos.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateFeature = async (
    id: string, 
    title: string, 
    description: string, 
    icon: string,
    order_number: number
  ) => {
    try {
      const { error } = await supabase
        .from('features')
        .update({ 
          title, 
          description,
          icon,
          order_number,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Recurso atualizado",
        description: "O recurso foi atualizado com sucesso.",
      });
      
      fetchFeatures();
    } catch (error) {
      console.error('Erro ao atualizar recurso:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o recurso.",
      });
    }
  };
  
  const addFeature = async (
    title: string, 
    description: string, 
    icon: string
  ) => {
    try {
      // Determine next order number
      const order_number = features.length > 0 
        ? Math.max(...features.map(f => f.order_number)) + 1
        : 1;
        
      const { error } = await supabase
        .from('features')
        .insert({ 
          title, 
          description,
          icon,
          order_number,
          updated_by: user?.id
        });
        
      if (error) throw error;
      
      toast({
        title: "Recurso adicionado",
        description: "O novo recurso foi adicionado com sucesso.",
      });
      
      fetchFeatures();
    } catch (error) {
      console.error('Erro ao adicionar recurso:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o novo recurso.",
      });
    }
  };
  
  const deleteFeature = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este recurso?")) return;
    
    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Recurso excluído",
        description: "O recurso foi excluído com sucesso.",
      });
      
      fetchFeatures();
    } catch (error) {
      console.error('Erro ao excluir recurso:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o recurso.",
      });
    }
  };
  
  const { user } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-idvl-blue-dark"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-idvl-blue-dark hover:bg-idvl-blue-light">
            Adicionar novo recurso
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Adicionar novo recurso</DialogTitle>
          </DialogHeader>
          <FeatureForm onSave={(title, description, icon) => addFeature(title, description, icon)} />
        </DialogContent>
      </Dialog>
      
      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-idvl-blue-dark font-semibold">#{feature.order_number}</span>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mt-1">{feature.description}</p>
                <p className="text-sm text-gray-500 mt-2">Ícone: {feature.icon}</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Editar</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Editar recurso</DialogTitle>
                    </DialogHeader>
                    <FeatureForm 
                      feature={feature} 
                      onSave={(title, description, icon) => 
                        updateFeature(feature.id, title, description, icon, feature.order_number)
                      } 
                    />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteFeature(feature.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {features.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum recurso encontrado. Adicione um novo recurso usando o botão acima.
        </div>
      )}
    </div>
  );
};

const FeatureForm = ({ 
  feature, 
  onSave 
}: { 
  feature?: any, 
  onSave: (title: string, description: string, icon: string) => void 
}) => {
  const [title, setTitle] = useState(feature?.title || '');
  const [description, setDescription] = useState(feature?.description || '');
  const [icon, setIcon] = useState(feature?.icon || '');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(title, description, icon);
    } finally {
      setLoading(false);
    }
  };
  
  const iconOptions = [
    "BookOpen", "PieChart", "CheckSquare", "FileText", "Info", 
    "BarChart", "Bell", "Users", "Calculator", "Settings", 
    "Database", "Globe", "HelpCircle", "Shield", "Star"
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do recurso"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do recurso"
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="icon">Ícone</Label>
        <select
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="" disabled>Selecione um ícone</option>
          {iconOptions.map((iconName) => (
            <option key={iconName} value={iconName}>{iconName}</option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-idvl-blue-dark hover:bg-idvl-blue-light"
        >
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export default Admin;
