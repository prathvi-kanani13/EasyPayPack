import PageCards from './Components/PageCards';
import { type RouteItem } from '@/utils/routes';

interface CardViewProps {
  items: RouteItem[];
  disabledRoutes: Record<string, boolean>;
  onToggleDisable: (route: string) => void;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
}

/**
 * CardView renders the paginated set of screen cards.
 * It acts as the card layout wrapper for AllScreens dashboard.
 */
export default function CardView({ items, disabledRoutes, onToggleDisable, isMd, isLg, isXl }: CardViewProps) {
  return (
    <PageCards
      items={items}
      disabledRoutes={disabledRoutes}
      onToggleDisable={onToggleDisable}
      isMd={isMd}
      isLg={isLg}
      isXl={isXl}
    />
  );
}
