import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { SELL_PROPERTY_ROUTE, RENT_PROPERTY_ROUTE } from "@/router/routeConstants";

export function DropdownMenuChoice() {
    const navigate = useNavigate();
    const [position, setPosition] = React.useState("bottom")

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-main-color rounded-md p-4 text-white mt-4 md:mt-0">
                    Create Post
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                    <DropdownMenuRadioItem value="top" onClick={() => navigate(RENT_PROPERTY_ROUTE)}>Rent</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom" onClick={() => navigate(SELL_PROPERTY_ROUTE)}>Sale</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
