import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Pen, Mail, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type Template, EMPLOYEES_DETAILS, SIGNATURES_DETAILS, compileTemplate } from './utils';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function LetterPreview() {
    const location = useLocation();
    const navigate = useNavigate();
    const template = location.state?.template as Template;

    const [selectedEmployee, setSelectedEmployee] = useState<string>('emp1');
    const [selectedSignature, setSelectedSignature] = useState<string>('default');
    const [zoomLevel, setZoomLevel] = useState<number>(100);

    const { html, text } = useMemo(() => {
        return compileTemplate(template, selectedEmployee, selectedSignature);
    }, [template, selectedEmployee, selectedSignature]);

    // If no template in state, bounce back
    if (!template) {
        return <Navigate to="/letter/generate" replace />;
    }

    const handleEdit = () => {
        navigate('/letter/editor', { state: { template } });
    };

    const handleDownload = () => {
        const employeeInfo = EMPLOYEES_DETAILS[selectedEmployee] || {};
        const employeeName = employeeInfo['Employee Name'] || 'Employee';

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Clean border
        doc.setDrawColor(220, 220, 220);
        doc.rect(10, 10, 190, 277);

        // Header Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(32, 44, 75);
        doc.text(template.name.toUpperCase(), 105, 30, { align: 'center' });

        // Line
        doc.setDrawColor(32, 44, 75);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);

        const lines = doc.splitTextToSize(text, 170);
        let yOffset = 50;

        lines.forEach((line: string) => {
            if (yOffset > 260) {
                doc.addPage();
                doc.setDrawColor(220, 220, 220);
                doc.rect(10, 10, 190, 277);
                yOffset = 30;
            }
            doc.text(line, 20, yOffset);
            yOffset += 7;
        });

        const safeTemplateName = template.name.replace(/\s+/g, '_');
        const safeEmployeeName = employeeName.replace(/\s+/g, '_');

        doc.save(`${safeTemplateName}_${safeEmployeeName}.pdf`);
    };

    const handleSendEmail = () => {
        toast.success('Email queued successfully!');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white flex items-center gap-2">
                        {template.name}
                        <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                            {template.category}
                        </span>
                    </h1>
                </div>
                <div className="flex flex-wrap justify-end gap-2 ml-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleEdit}
                    >
                        <Pen className="w-4 h-4" /> Edit Template
                    </Button>
                    <Button
                        className="bg-theme hover:bg-[#d9561c] text-white gap-2"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4" /> Download
                    </Button>
                    <Button
                        variant="default"
                        className="gap-2"
                        onClick={handleSendEmail}
                    >
                        <Mail className="w-4 h-4" /> Send as Email
                    </Button>
                </div>
            </div>

            {/* Document Controls */}
            <Card className="rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                <CardContent className="p-4 flex flex-wrap gap-4 items-center">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium">Select Employee</Label>
                        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                            <SelectTrigger className='h-10!'>
                                <SelectValue placeholder="Select Employee..." />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(EMPLOYEES_DETAILS).map(([id, emp]) => (
                                    <SelectItem key={id} value={id}>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback className="text-[10px]">{emp['Employee Name'].charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col text-left">
                                                <span>{emp['Employee Name']}</span>
                                                <span className="text-xs text-muted-foreground">{emp['Employee Code']}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium">Select Signature</Label>
                        <Select value={selectedSignature} onValueChange={setSelectedSignature}>
                            <SelectTrigger className='h-10!'>
                                <SelectValue placeholder="Select Signature..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Template Default</SelectItem>
                                {Object.entries(SIGNATURES_DETAILS).map(([id, sig]) => (
                                    <SelectItem key={id} value={id}>
                                        <div className="flex flex-col text-left">
                                            <span>{sig.name}</span>
                                            <span className="text-xs text-muted-foreground">{sig.designation}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-muted-foreground">Date of Issue</Label>
                        <div className="h-10 flex items-center px-3 border rounded-md bg-muted/50 text-sm">
                            {format(new Date(), 'dd MMM, yyyy')}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium text-muted-foreground">File Format</Label>
                        <div className="h-10 flex items-center px-3 border rounded-md bg-muted/50 text-sm">
                            PDF Document
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Document Preview Area */}
            <div className="flex flex-col border rounded-md bg-muted/30 relative overflow-hidden min-h-[600px]">
                {/* Zoom Controls */}
                <div className="absolute top-4 right-6 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md border shadow-sm">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoomLevel(z => Math.max(z - 10, 50))}>
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-xs font-medium w-12 text-center">{zoomLevel}%</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoomLevel(z => Math.min(z + 10, 200))}>
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoomLevel(100)}>
                        <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                </div>

                {/* Canvas Container */}
                <div className="flex-1 overflow-auto w-full p-4 flex justify-center custom-scrollbar">
                    <div
                        className="bg-white shadow-md transition-transform duration-200 origin-top text-black"
                        style={{
                            width: '210mm',
                            minHeight: '297mm',
                            transform: `scale(${zoomLevel / 100})`,
                            padding: '20mm'
                        }}
                    >
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                </div>

                {/* Footer Metadata */}
                <div className="bg-background border-t p-3 flex justify-between items-center text-xs text-muted-foreground">
                    <div>Dimensions: A4 (210 x 297 mm)</div>
                    <div className="flex gap-4">
                        <span>Created By: Admin</span>
                        <span>Created: {template.createdAt}</span>
                    </div>
                </div>
            </div>
        </div >
    );
}
