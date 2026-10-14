import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductMenu, navLinks, dropdownItemsMap, type DropdownId } from "@/components/layout/HeaderMenuContent";
import { cn } from "@/lib/utils";

interface Props { jobsActive: boolean; onBrowseJobs: () => void; }

export function ProSiteNavigation({ jobsActive, onBrowseJobs }: Props) {
  const [open, setOpen] = useState<DropdownId | null>(null);
  return <nav aria-label="Candidate main navigation" className="order-3 flex w-full min-w-0 items-center gap-1 overflow-x-auto border-t border-border py-2 xl:order-none xl:w-auto xl:border-0 xl:py-0">
    {navLinks.map(link => {
      const id = link.dropdownId;
      const classes = "h-9 shrink-0 px-3 text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary";
      if (id) return <DropdownMenu key={id} open={open === id} onOpenChange={value => setOpen(value ? id : null)}>
        <DropdownMenuTrigger asChild><Button variant="ghost" className={classes}>{link.label}<ChevronDown className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className={cn("max-h-[min(70vh,620px)] overflow-y-auto", id === "products" ? "w-[640px] max-w-[calc(100vw-2rem)] p-0" : "w-44")} onClick={event => { if ((event.target as HTMLElement).closest("a")) setOpen(null); }}>
          {id === "products" ? <ProductMenu /> : dropdownItemsMap[id].map(item => <DropdownMenuItem key={item.href} asChild><Link to={item.href}>{item.label}</Link></DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>;
      if (link.href === "/jobs") return <Button key={link.href} variant="ghost" aria-current={jobsActive ? "page" : undefined} className={cn(classes, jobsActive && "bg-primary/10 text-primary")} onClick={onBrowseJobs}>{link.label}</Button>;
      return <Button key={link.href} asChild variant="ghost" className={classes}><Link to={link.href}>{link.label}</Link></Button>;
    })}
  </nav>;
}
