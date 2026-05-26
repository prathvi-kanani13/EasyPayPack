import { useState, useMemo } from 'react';
import { DataTable } from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { Card } from '@/components/ui/card';
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, FileText, ArrowLeft } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
import { type Template } from './utils';


const MOCK_TEMPLATES: Template[] = [
    {
        id: '1',
        name: 'Offer Letter Standard',
        category: 'Offer Letters',
        description: 'Standard employment offer letter for new hires.',
        createdAt: '2023-10-15',
        nodes: {
            root: {
                id: 'root',
                type: 'root',
                props: { padding: '20px', backgroundColor: '#ffffff', width: '100%', height: '100%' },
                children: ['h1', 'p1', 'p2', 'p3'],
                parentId: null,
            },
            h1: {
                id: 'h1',
                type: 'heading',
                props: { text: 'Offer of Employment', level: 'h2', textAlign: 'center' },
                children: [],
                parentId: 'root'
            },
            p1: {
                id: 'p1',
                type: 'paragraph',
                props: { text: 'Dear {{Employee Name}},' },
                children: [],
                parentId: 'root'
            },
            p2: {
                id: 'p2',
                type: 'paragraph',
                props: { text: 'We are pleased to offer you the position of {{Designation}} in the {{Department}} department at our firm. Your starting salary will be {{Salary}} per annum, and your scheduled joining date is {{Joining Date}}.' },
                children: [],
                parentId: 'root'
            },
            p3: {
                id: 'p3',
                type: 'paragraph',
                props: { text: 'We are excited about the prospect of you joining our team.\n\nSincerely,\n\n{{Signature}}' },
                children: [],
                parentId: 'root'
            }
        }
    },
    {
        id: '2',
        name: 'Promotion Letter',
        category: 'Appraisal Letters',
        description: 'Template for internal promotions.',
        createdAt: '2024-01-20',
        nodes: {
            root: {
                id: 'root',
                type: 'root',
                props: { padding: '20px', backgroundColor: '#ffffff', width: '100%', height: '100%' },
                children: ['h1', 'p1', 'p2', 'p3'],
                parentId: null,
            },
            h1: {
                id: 'h1',
                type: 'heading',
                props: { text: 'Letter of Promotion', level: 'h2', textAlign: 'center' },
                children: [],
                parentId: 'root'
            },
            p1: {
                id: 'p1',
                type: 'paragraph',
                props: { text: 'Dear {{Employee Name}},' },
                children: [],
                parentId: 'root'
            },
            p2: {
                id: 'p2',
                type: 'paragraph',
                props: { text: 'We are delighted to inform you that you have been promoted to the position of {{Designation}} in the {{Department}} department. This promotion is a reflection of your hard work, dedication, and significant contributions to the company.' },
                children: [],
                parentId: 'root'
            },
            p3: {
                id: 'p3',
                type: 'paragraph',
                props: { text: 'Your new compensation package and detailed responsibilities will be shared shortly.\n\nCongratulations on this well-deserved promotion!\n\nBest regards,\n\n{{Signature}}' },
                children: [],
                parentId: 'root'
            }
        }
    }
];

export default function LetterGenerator() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
    const [pageIndex, setPageIndex] = useState(0);

    const handleDelete = async (id: string) => {
        const { isConfirmed } = await showAlert({
            title: "Are you sure?",
            description: "You are about to delete this template. This action cannot be undone.",
            confirmation: true,
            variant: 'danger',
            buttonText: 'Delete'
        });

        if (isConfirmed) {
            setTemplates(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleEdit = (template: Template) => {
        navigate('/letter/editor', { state: { template } });
    };

    const handleGenerateClick = (template: Template) => {
        navigate('/letter/preview', { state: { template } });
    };

    const columnHelper = createColumnHelper<Template>();
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Template Name',
            cell: info => info.getValue()
        }),
        columnHelper.accessor('category', {
            header: 'Category',
            cell: info => info.getValue()
        }),
        columnHelper.accessor('createdAt', {
            header: 'Created At',
            cell: info => new Date(info.getValue()).toLocaleDateString()
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)} className="h-8 px-2" title="Edit Template">
                        <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleGenerateClick(row.original)} className="h-8 px-2" title="Generate Letter">
                        <FileText size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)} className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" title="Delete Template">
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [columnHelper, handleDelete]);

    const table = useReactTable({
        data: templates,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination: { pageIndex, pageSize: 10 }
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex, pageSize: 10 });
                setPageIndex(newState.pageIndex);
            }
        },
        manualPagination: true,
        pageCount: Math.ceil(templates.length / 10),
    });

    return (
        <div className="flex flex-col gap-4">
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
                    Add Signature
                </h1>
            </div>

            <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700 gap-0">
                <div className="flex items-center justify-between flex-wrap border-b dark:border-gray-700 gap-4 pb-4 mb-4">
                    <div className="text-lg font-semibold">Template List</div>
                </div>

                <DataTable
                    table={table}
                    isLoading={false}
                    isError={false}
                    columnCount={columns.length}
                    errorMessage="No Data Found"
                />

                <Pagination
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    isNextDisabled={pageIndex >= Math.ceil(templates.length / 10) - 1}
                />
            </Card>

        </div>
    );
}
