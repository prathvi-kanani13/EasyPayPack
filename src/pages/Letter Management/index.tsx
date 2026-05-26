import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LetterInfoForm from "./editor components/letterInfo";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import EditorContentSettings from "./editor components/editorContentSettings";
import EditorLayoutSettings from "./editor components/editorLayoutSettings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState, useRef } from "react";
import EditorCanvas from "./editor components/editorCanvas";
import { EditorProvider, useEditor } from "./editor components/EditorContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const validationSchema = Yup.object().shape({
  templateName: Yup.string().required("Template Name is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string(),
});

interface FormValues {
  templateName: string;
  category: string;
  description?: string;
}

const defaultInitialValues: FormValues = {
  templateName: "",
  category: "",
  description: "",
};

function LetterManagementInner({ initialValues }: { initialValues: FormValues }) {
  const navigate = useNavigate();
  const { generateHtml, state } = useEditor();
  const [contentSettingsOpen, setContentSettingsOpen] = useState<boolean>(false);
  const [layoutSettingsOpen, setLayoutSettingsOpen] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsMobile(entry.contentRect.width <= 1050);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (values: typeof initialValues) => {
    const html = generateHtml();
    const payload = {
      ...values,
      letterHtml: html
    };
    console.log("Submitted Payload:", payload);
  };

  const handlePreview = () => {
    const html = generateHtml();
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Document Preview</title>
                    <style>
                        * { box-sizing: border-box; }
                        body { margin: 0; padding: 20px; font-family: sans-serif; background: #f3f4f6; display: flex; justify-content: center; }
                        .preview-container { background: white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); width: ${state.canvasSize.width}px; min-height: ${state.canvasSize.height}px; overflow: hidden; }
                        /* TipTap generated HTML styles */
                        .tiptap-content p { margin: 0; }
                        .tiptap-content p:empty::after { content: "\x00a0"; }
                        .tiptap-content ul { list-style-type: disc; padding-left: 1.5em; margin: 0.25em 0; }
                        .tiptap-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.25em 0; }
                        .tiptap-content li { margin: 0.1em 0; }
                        .tiptap-content li p { margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="preview-container">
                        ${html}
                    </div>
                </body>
                </html>
            `);
      previewWindow.document.close();
    }
  };

  return (

    <div className="flex flex-col gap-4">
      {/* Header Section with Title and Actions */}
      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={'ghost'}
            onClick={() => navigate(-1)}
            size={'icon-sm'}
          >
            <ArrowLeft className="text-[#202C4B] dark:text-white" style={{ height: '24px', width: '24px' }} />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-[#202C4B] dark:text-white">
            Letter Editor
          </h1>
        </div>
        <div className="flex flex-1 flex-wrap justify-end gap-2">
          <Button
            type="button"
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            type="submit"
            form="letter-form"
          >
            Save
          </Button>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-4 h-[calc(100vh+15rem)] md:h-[calc(100vh-8.75rem)]">
        <Card className="shadow-sm w-full h-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form id="letter-form" className="w-full">
                  <LetterInfoForm
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </Form>
              )}
            </Formik>
          </CardHeader>

          <CardContent ref={containerRef} className="relative px-0 py-0 flex-1 overflow-hidden">
            <SidebarProvider className="relative min-h-0 h-full" open={contentSettingsOpen} onOpenChange={setContentSettingsOpen} isMobileProp={isMobile}>
              <EditorContentSettings />

              <SidebarProvider className="relative min-h-0 h-full" open={layoutSettingsOpen} onOpenChange={setLayoutSettingsOpen} isMobileProp={isMobile}>
                <div className="flex-1 bg-white dark:bg-zinc-950 h-full">
                  <EditorCanvas
                    isMobile={isMobile}
                    setContentSettingsOpen={setContentSettingsOpen}
                    setLayoutSettingsOpen={setLayoutSettingsOpen}
                  />
                </div>

                <EditorLayoutSettings />
              </SidebarProvider>
            </SidebarProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function LetterManagement() {
  const location = useLocation();
  const template = location.state?.template;

  const formValues = template ? {
    templateName: template.name,
    category: template.category,
    description: template.description || ""
  } : defaultInitialValues;

  const initialNodes = template ? template.nodes : undefined;

  return (
    <EditorProvider initialNodes={initialNodes}>
      <LetterManagementInner initialValues={formValues} />
    </EditorProvider>
  );
}