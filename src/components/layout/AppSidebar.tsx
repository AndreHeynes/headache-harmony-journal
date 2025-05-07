
import { PlusCircle, BarChart2, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: "/lovable-uploads/78336bbf-2702-4d43-abaa-d5f6e646d8b4.png", url: "/" },
  { title: "New Entry", icon: PlusCircle, url: "/new" },
  { title: "Insights", icon: BarChart2, url: "/insights" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export default function AppSidebar() {
  return (
    <Sidebar className="border-r border-primary/20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-charcoal/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 text-charcoal/80 hover:text-charcoal">
                      {typeof item.icon === 'string' ? (
                        <img src={item.icon} alt={item.title} className="h-5 w-5 rounded-full" />
                      ) : (
                        <item.icon className="h-5 w-5" />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
