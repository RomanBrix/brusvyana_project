export default function Ukrpochta({ ukrpochtaFields, changeUkrpochtaData }) {
    console.log(ukrpochtaFields);
    return (
        <>
            <div className="one-input">
                <label htmlFor="street">Вулиця</label>
                <input
                    type="text"
                    id="street"
                    value={ukrpochtaFields.street}
                    onChange={changeUkrpochtaData}
                />
            </div>
            <div className="one-input">
                <label htmlFor="house">Номер будинку</label>
                <input
                    type="text"
                    id="house"
                    value={ukrpochtaFields.house}
                    onChange={changeUkrpochtaData}
                />
            </div>
            <div className="one-input">
                <label htmlFor="postcode">Поштовий індекс </label>
                <input
                    type="text"
                    id="postcode"
                    value={ukrpochtaFields.postcode}
                    onChange={changeUkrpochtaData}
                />
            </div>
        </>
    );
}
