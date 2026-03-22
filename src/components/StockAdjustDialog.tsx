import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';
import type { Product } from '@/hooks/useProducts';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { productId: string; type: 'entrada' | 'saida' | 'ajuste'; quantity: number; notes?: string }) => void;
  product: Product | null;
  loading?: boolean;
}

export default function StockAdjustDialog({ open, onClose, onSubmit, product, loading }: Props) {
  const [type, setType] = useState<'entrada' | 'saida' | 'ajuste'>('entrada');
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || quantity <= 0) return;
    onSubmit({ productId: product.id, type, quantity, notes: notes || undefined });
  };

  const types = [
    { value: 'entrada' as const, label: 'Entrada', icon: ArrowUpCircle, color: 'text-emerald-600' },
    { value: 'saida' as const, label: 'Saída', icon: ArrowDownCircle, color: 'text-red-500' },
    { value: 'ajuste' as const, label: 'Ajuste', icon: RefreshCw, color: 'text-amber-500' },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Movimentar Estoque</DialogTitle>
        </DialogHeader>
        {product && (
          <p className="text-sm text-muted-foreground">
            {product.name} — Estoque atual: <span className="font-semibold tabular-nums text-foreground">{product.quantity} {product.unit}</span>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {types.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex-1 flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all active:scale-[0.97] ${
                  type === t.value ? 'border-primary bg-secondary' : 'border-border hover:border-primary/30'
                }`}
              >
                <t.icon className={`h-5 w-5 ${t.color}`} />
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>{type === 'ajuste' ? 'Nova Quantidade' : 'Quantidade'}</Label>
            <Input type="number" value={quantity} onChange={e => setQuantity(+e.target.value)} min={0} required />
          </div>
          <div className="space-y-2">
            <Label>Observação</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Opcional..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading || quantity <= 0} className="active:scale-[0.97] transition-transform">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
