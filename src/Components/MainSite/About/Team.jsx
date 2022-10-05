export default function  Team() {
    const team = [
        {
            img: '1.jpg',
            name: 'Ліліана Дмитрієва',
            position: 'Директор "Брусв`яна"',
            description: 'Директор в розплідник "Брусв`яна" та голова правління в "Декоративне рослинництво України" громадська спілка (ДРУГС)'           
        },
        {
            img: '2.jpg',
            name: 'Катерина Євпак',
            position: 'Технолог "Брусвяна"',
            description: ''
        },
    ]
    return(
        <div className="about-main about-main-team">
            <div className="content">
                <div className="text-content">
                    <h1>Команда</h1>
                    <div className="team-blocks">
                        {renderTeamBlock()}
                    </div>
                </div>
            </div>
        </div>
    )

    function renderTeamBlock() {
        return team.map((item, index) => {
            return (
                <div className="block" key={index}>
                    <div className="img-block" style={{backgroundImage: `url(/src/team/${item.img})`}}>
                        {/* <img src={`/src/team/${item.img}`} alt=""/> */}
                    </div>
                    <div className="text-block">
                        <div className="name">{item.name}</div>
                        <div className="position">{item.position}</div>
                        <div className="description">{item.description}</div>
                    </div>
                </div>
            )
        } )
    }
}