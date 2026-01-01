import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import {Underline} from '@tiptap/extension-underline';
import {TextAlign} from '@tiptap/extension-text-align';
import {Highlight} from '@tiptap/extension-highlight';
import {Link} from '@tiptap/extension-link';
import {Image} from '@tiptap/extension-image';
import {Placeholder} from '@tiptap/extension-placeholder';
import {TextStyle} from '@tiptap/extension-text-style';
import {Color} from '@tiptap/extension-color';
import {CodeBlockLowlight} from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Image as ImageIcon,
    Quote,
    Minus,
    Undo,
    Redo,
    Highlighter,
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    CodeSquare,
    Palette,
    X,
} from 'lucide-react';
import axios from 'axios';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
}

const MenuButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children,
    title
}: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <Toggle
        size="sm"
        pressed={isActive}
        onPressedChange={onClick}
        disabled={disabled}
        title={title}
        className="h-8 w-8 p-0"
    >
        {children}
    </Toggle>
);

export default function TiptapEditor({ 
    content, 
    onChange, 
    placeholder = "Commencez à écrire votre article...",
    editable = true 
}: TiptapEditorProps) {
    const [linkUrl, setLinkUrl] = React.useState('');
    const [linkOpen, setLinkOpen] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState('');
    const [imageOpen, setImageOpen] = React.useState(false);
    const [colorOpen, setColorOpen] = React.useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            // Underline,
            // TextAlign.configure({
            //     types: ['heading', 'paragraph'],
            // }),
            Highlight.configure({
                multicolor: true,
            }),
            // Link.configure({
            //     openOnClick: false,
            //     HTMLAttributes: {
            //         class: 'text-primary underline cursor-pointer',
            //     },
            // }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto mx-auto',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextStyle,
            Color,
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        }
        setLinkUrl('');
        setLinkOpen(false);
    }, [editor, linkUrl]);

    const addImage = useCallback(() => {
        if (!editor || !imageUrl) return;
        editor.chain().focus().setImage({ src: imageUrl }).run();
        setImageUrl('');
        setImageOpen(false);
    }, [editor, imageUrl]);

    const uploadImage = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/admin/blogs/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.url && editor) {
                editor.chain().focus().setImage({ src: response.data.url }).run();
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    }, [editor]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    }, [uploadImage]);

    const colors = [
        '#000000', '#374151', '#6b7280', '#9ca3af',
        '#ef4444', '#f97316', '#f59e0b', '#eab308',
        '#84cc16', '#22c55e', '#10b981', '#14b8a6',
        '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
        '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    ];

    const highlightColors = [
        '#fef08a', '#fde047', '#fbbf24',
        '#bef264', '#86efac', '#6ee7b7',
        '#99f6e4', '#a5f3fc', '#a5b4fc',
        '#f0abfc', '#fda4af', '#fed7aa',
    ];

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg overflow-hidden bg-background">
            {/* Toolbar */}
            <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50">
                {/* Undo/Redo */}
                <MenuButton 
                    onClick={() => editor.chain().focus().undo().run()} 
                    disabled={!editor.can().undo()}
                    title="Annuler"
                >
                    <Undo className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().redo().run()} 
                    disabled={!editor.can().redo()}
                    title="Rétablir"
                >
                    <Redo className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                {/* Headings */}
                <Select
                    value={
                        editor.isActive('heading', { level: 1 }) ? 'h1' :
                        editor.isActive('heading', { level: 2 }) ? 'h2' :
                        editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
                    }
                    onValueChange={(value) => {
                        if (value === 'p') {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            const level = parseInt(value.replace('h', '')) as 1 | 2 | 3;
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                >
                    <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="p">
                            <span className="flex items-center gap-2">
                                <Pilcrow className="h-4 w-4" /> Paragraphe
                            </span>
                        </SelectItem>
                        <SelectItem value="h1">
                            <span className="flex items-center gap-2">
                                <Heading1 className="h-4 w-4" /> Titre 1
                            </span>
                        </SelectItem>
                        <SelectItem value="h2">
                            <span className="flex items-center gap-2">
                                <Heading2 className="h-4 w-4" /> Titre 2
                            </span>
                        </SelectItem>
                        <SelectItem value="h3">
                            <span className="flex items-center gap-2">
                                <Heading3 className="h-4 w-4" /> Titre 3
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Separator orientation="vertical" className="mx-1 h-8" />

                {/* Text formatting */}
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBold().run()} 
                    isActive={editor.isActive('bold')}
                    title="Gras"
                >
                    <Bold className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleItalic().run()} 
                    isActive={editor.isActive('italic')}
                    title="Italique"
                >
                    <Italic className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleUnderline().run()} 
                    isActive={editor.isActive('underline')}
                    title="Souligné"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleStrike().run()} 
                    isActive={editor.isActive('strike')}
                    title="Barré"
                >
                    <Strikethrough className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleCode().run()} 
                    isActive={editor.isActive('code')}
                    title="Code inline"
                >
                    <Code className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                {/* Colors */}
                <Popover open={colorOpen} onOpenChange={setColorOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Couleur du texte">
                            <Palette className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="space-y-2">
                            <Label>Couleur du texte</Label>
                            <div className="grid grid-cols-10 gap-1">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className="w-5 h-5 rounded border hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editor.chain().focus().setColor(color).run();
                                            setColorOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                    editor.chain().focus().unsetColor().run();
                                    setColorOpen(false);
                                }}
                            >
                                <X className="h-3 w-3 mr-1" /> Réinitialiser
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Surligner">
                            <Highlighter className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="space-y-2">
                            <Label>Couleur de surlignage</Label>
                            <div className="grid grid-cols-6 gap-1">
                                {highlightColors.map((color) => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editor.chain().focus().toggleHighlight({ color }).run();
                                        }}
                                    />
                                ))}
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full"
                                onClick={() => editor.chain().focus().unsetHighlight().run()}
                            >
                                <X className="h-3 w-3 mr-1" /> Supprimer
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="mx-1 h-8" />

                {/* Lists */}
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBulletList().run()} 
                    isActive={editor.isActive('bulletList')}
                    title="Liste à puces"
                >
                    <List className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                    isActive={editor.isActive('orderedList')}
                    title="Liste numérotée"
                >
                    <ListOrdered className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                {/* Alignment */}
                <MenuButton 
                    onClick={() => editor.chain().focus().setTextAlign('left').run()} 
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Aligner à gauche"
                >
                    <AlignLeft className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().setTextAlign('center').run()} 
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Centrer"
                >
                    <AlignCenter className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().setTextAlign('right').run()} 
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Aligner à droite"
                >
                    <AlignRight className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    title="Justifier"
                >
                    <AlignJustify className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                {/* Block elements */}
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleBlockquote().run()} 
                    isActive={editor.isActive('blockquote')}
                    title="Citation"
                >
                    <Quote className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
                    isActive={editor.isActive('codeBlock')}
                    title="Bloc de code"
                >
                    <CodeSquare className="h-4 w-4" />
                </MenuButton>
                <MenuButton 
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Ligne horizontale"
                >
                    <Minus className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                {/* Link */}
                <Popover open={linkOpen} onOpenChange={setLinkOpen}>
                    <PopoverTrigger asChild>
                        <Button 
                            variant={editor.isActive('link') ? 'secondary' : 'ghost'} 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            title="Lien"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>URL du lien</Label>
                                <Input
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && setLink()}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={setLink} className="flex-1">
                                    Appliquer
                                </Button>
                                {editor.isActive('link') && (
                                    <Button 
                                        size="sm" 
                                        variant="destructive"
                                        onClick={() => {
                                            editor.chain().focus().unsetLink().run();
                                            setLinkOpen(false);
                                        }}
                                    >
                                        Supprimer
                                    </Button>
                                )}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Image */}
                <Popover open={imageOpen} onOpenChange={setImageOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Image">
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>URL de l'image</Label>
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                                />
                                <Button size="sm" onClick={addImage} className="w-full">
                                    Insérer depuis URL
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-popover px-2 text-muted-foreground">ou</span>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="image-upload" className="cursor-pointer">
                                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
                                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Cliquez pour uploader une image
                                        </p>
                                    </div>
                                </Label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Editor Content */}
            <EditorContent 
                editor={editor} 
                className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none p-4 min-h-[400px] focus:outline-none [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:h-0"
            />

            {/* Bubble Menu for quick formatting */}
            {editor && (
                <BubbleMenu editor={editor} updateDelay={100}>
                    <div className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-lg">
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleBold().run()} 
                            isActive={editor.isActive('bold')}
                        >
                            <Bold className="h-4 w-4" />
                        </MenuButton>
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleItalic().run()} 
                            isActive={editor.isActive('italic')}
                        >
                            <Italic className="h-4 w-4" />
                        </MenuButton>
                        <MenuButton 
                            onClick={() => editor.chain().focus().toggleUnderline().run()} 
                            isActive={editor.isActive('underline')}
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </MenuButton>
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <MenuButton 
                            onClick={() => {
                                const url = window.prompt('URL:');
                                if (url) {
                                    editor.chain().focus().setLink({ href: url }).run();
                                }
                            }} 
                            isActive={editor.isActive('link')}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </MenuButton>
                    </div>
                </BubbleMenu>
            )}
        </div>
    );
}
