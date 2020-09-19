export interface Incident {
    name: string | null;
    age: number | null;
    isMale: boolean | null;
    race: number | null;
    imageUrl: string | null;
    date: Date;
    address: string | null;
    county: number | null;
    zipcode: number | null;
    agency: number | null;
    cause: number;
    description: string;
    useOfForce: number;
    articleUrl: string | null;
    videoUrl: string | null;
    city: number | null;
}
