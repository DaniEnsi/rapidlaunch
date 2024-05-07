import {
    BarChart4Icon,
    BookTextIcon,
    Building2Icon,
    CreditCardIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    MessageSquareIcon,
    PenLineIcon,
    Settings2Icon,
    UserRoundCheckIcon,
    UserRoundPlusIcon,
    UsersRoundIcon,
    ClockIcon, // Importing the ClockIcon for the examtimer feature
} from "lucide-react";
import { siteUrls } from "@/config/urls";

type IconProps = React.HTMLAttributes<SVGElement>;

type NavItemBase = {
    label: string;
    icon: React.ComponentType<IconProps>;
    disabled?: boolean;
};

type NavItemWithHref = NavItemBase & {
    href: string;
    external?: boolean;
    subMenu?: never;
};

type NavItemWithSubMenu = NavItemBase & {
    href?: never;
    subMenu: {
        label: string;
        href: string;
        icon: React.ComponentType<IconProps>;
        external?: boolean;
        disabled?: boolean;
    }[];
};

type NavItem = NavItemWithHref | NavItemWithSubMenu;

export type SidebarNavItems = {
    id: string;
    label: string;
    showLabel?: boolean;
    items: NavItem[];
};

const navIds = {
    admin: "admin",
    general: "general",
    org: "org",
    resources: "resources",
    examtimer: "examtimer", // Adding the examtimer id to the navIds
};

const navigation: SidebarNavItems[] = [
    {
        id: navIds.admin,
        label: "Admin",
        showLabel: true,
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboardIcon,
                href: siteUrls.admin.dashboard,
            },
            {
                label: "Users",
                icon: UsersRoundIcon,
                href: siteUrls.admin.users,
            },
            {
                label: "Organizations",
                icon: Building2Icon,
                href: siteUrls.admin.organizations,
            },
            {
                label: "Analytics",
                icon: BarChart4Icon,
                href: siteUrls.admin.analytics,
            },
            {
                label: "Feedback List",
                icon: HelpCircleIcon,
                href: siteUrls.admin.feedbacks,
            },
        ],
    },
    {
        id: navIds.general,
        label: "General",
        showLabel: true,
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboardIcon,
                href: siteUrls.dashboard.home,
            },
        ],
    },
    {
        id: navIds.org,
        label: "Organization",
        showLabel: true,
        items: [
            {
                label: "Members",
                icon: UsersRoundIcon,
                subMenu: [
                    {
                        label: "Org Members",
                        icon: UserRoundCheckIcon,
                        href: siteUrls.organization.members.home,
                    },
                    {
                        label: "Invite Members",
                        icon: UserRoundPlusIcon,
                        href: siteUrls.organization.members.invite,
                    },
                ],
            },
            {
                label: "Plans & Billing",
                icon: CreditCardIcon,
                href: siteUrls.organization.plansAndBilling,
            },
            {
                label: "Settings",
                icon: Settings2Icon,
                href: siteUrls.organization.settings,
            },
        ],
    },
    {
        id: navIds.resources,
        label: "Resources",
        showLabel: true,
        items: [
            {
                label: "Feedbacks",
                icon: MessageSquareIcon,
                href: siteUrls.feedback,
            },
            {
                label: "Docs",
                icon: BookTextIcon,
                href: siteUrls.docs,
            },
            {
                label: "Blog",
                icon: PenLineIcon,
                href: siteUrls.blog,
            },
            {
                label: "Support",
                icon: HelpCircleIcon,
                href: siteUrls.support,
            },
        ],
    },
    {
        id: navIds.examtimer, // Adding the examtimer navigation item
        label: "Exam Timer",
        showLabel: true,
        items: [
            {
                label: "Timer",
                icon: ClockIcon,
                href: "/examtimer", // Assuming the route to the examtimer feature
            },
        ],
    },
];

export function filteredNavItems({
    removeIds = [],
    includedIds = [],
}: FilterNavItemsProps) {
    let includedItems = sidebarConfig.navigation;

    if (includedIds.length) {
        includedItems = includedItems.filter((item) =>
            includedIds.includes(item.id),
        );
    }

    if (removeIds.length) {
        includedItems = includedItems.filter(
            (item) => !removeIds.includes(item.id),
        );
    }

    return includedItems;
}

export const sidebarConfig = {
    navIds,
    navigation,
    filteredNavItems,
} as const;
