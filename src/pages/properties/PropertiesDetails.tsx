import { PropertyDetailComponent } from "@/components/propertiesComponents"
import { usePropertyStore } from "@/store/property"
import { Property } from "@/supabase/collections"
import { useParams } from "react-router-dom"

export const PropertiesDetails = () => {
    const { id } = useParams()
    const property: Property = usePropertyStore(store => store.properties.find(property => property.id === Number(id))) as Property;

    return (
        <div className="w-full">
            <PropertyDetailComponent property={property} />
        </div>
    )
}
