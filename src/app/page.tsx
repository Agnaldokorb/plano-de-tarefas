import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Save,
  ListCheck,
  Scroll,
  CheckCheck,
  ListChecks,
  SquarePen,
  Trash,
  Sigma,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Home = () => {
  return (
    <main className="w-full h-screen bg-gray-100 flex flex-col justify-center items-center">
      <Card className="w-xl ">
        <CardTitle className="flex justify-center items-center text-2xl font-bold text-blue-500">
          Plano de tarefas
        </CardTitle>

        <CardHeader className="flex gap-2">
          <Input placeholder="Digite sua tarefa" />
          <Button variant="default" className="cursor-pointer">
            <Plus /> Cadastrar
          </Button>
        </CardHeader>

        <CardContent>
          <Separator />
          <div className="mt-4 flex gap-2 justify-center">
            <Badge variant="default" className="cursor-pointer ">
              <ListCheck /> Todas
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              <Scroll /> Não concluidas
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              <CheckCheck /> Concluidas
            </Badge>
          </div>

          <div className="mt-4 border-b-2">
            <div className=" h-10 flex items-center justify-between border-t-2 ">
              <div className="w-1 h-full bg-green-400"></div>
              <p className="flex-1 px-2">Estudar java</p>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <SquarePen className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar tarefa</DialogTitle>
                      <div className="mt-4 flex gap-2">
                        <Input placeholder="Digite sua tarefa" />
                        <Button variant="default" className="cursor-pointer">
                          <Save /> Salvar
                        </Button>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash className="cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem Certeza que deseja excluir esta tarefa?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente esta tarefa.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>Continuar</AlertDialogAction>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="p-4">
          <Separator className="mb-4" />

          <div className="flex justify-between items-center w-full">
            <p className="flex items-center gap-2">
              <ListChecks />
              tarefas concluídas (3/3)
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                  <Trash />
                  Limpar tarefas concluidas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem Certeza que deseja excluir X tarefas concluidas?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente suas tarefas concluídas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Continuar</AlertDialogAction>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="h-3 w-full bg-gray-200 mt-4 rounded-2xl">
            <div
              className="h-full bg-green-400 rounded-2xl"
              style={{ width: "70%" }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-4">
            <p className="flex items-center gap-2">
              <Sigma />3 tarefas no total
            </p>
          </div>
        </div>
      </Card>
      <footer>
        <p className="text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} - Desenvolvido por{" "}
          <a href="mailto:agnaldokorb@gmail.com" className="text-blue-500">
            Agnaldo Korb
          </a>
        </p>
      </footer>
    </main>
  );
};

export default Home;