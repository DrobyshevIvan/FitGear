interface Props {
    title: string;
    pricePerDay: number;
}

export const CardTitle = ({title, pricePerDay}: Props) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row"
        }}>
            <p className="card__title">{title}</p>
            <p className="card__title">{pricePerDay}</p>
        </div>
    )
}
