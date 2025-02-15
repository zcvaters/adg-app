export interface BoardMember {
    name: string;
    position: string;
    imageUrl?: string;
}

export const boardMembers: BoardMember[] = [
    {
        name: "Ed Hartling",
        position: "President",
        imageUrl: "https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-1/460721404_10164214810104202_5990954463535669493_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=15y_9yon7Z4Q7kNvgG0zfc9&_nc_oc=AdgzLUXsMfjZNVbiFF7-PK31bM9tvfYQfPj2AYu7yaBUXBxdpro2cdrq6qmNfJrK_L8&_nc_zt=24&_nc_ht=scontent-lga3-1.xx&_nc_gid=Ap6DKgfK__Kglt3vNHhocD-&oh=00_AYBeGXKaz9JQTAOYuGByfREGsiT34WcQVFSlSPfjQZdQbQ&oe=67B59D63"
    },
    {
        name: "Adam Peddle",
        position: "Vice President",
        imageUrl: "https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-1/467774899_10169651303315062_1041394444340251996_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=g55FlW-BHcMQ7kNvgHS3orK&_nc_oc=Adh9g6i4mwRJdrHYNgpWiZFfoqrP2diBfqrBY1TFA7MdcQIVlcD4wIfaQjT_oPmKrk8&_nc_zt=24&_nc_ht=scontent-lga3-1.xx&_nc_gid=ADoGa0nV0Oefha6UdGrTMC5&oh=00_AYC7mck2sYnCg8PfzmRA5Mru8otwAwzV_EI8RfWGtLb8Lg&oe=67B5A349"
    },
    {
        name: "Cordale Langford",
        position: "Treasurer",
        imageUrl: "https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-1/442409177_10225900549596735_7330396610591942729_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=KC4rtFifByIQ7kNvgEaNlvz&_nc_oc=AdhHpzyHCmvdOF83IeGNRhMZvdTvLI99ofxf6wmsvlvwf9FrOUL05kNpotHd1n73pkU&_nc_zt=24&_nc_ht=scontent-lga3-2.xx&_nc_gid=AgYCyQcBkHS_E3AFuOsX_Z8&oh=00_AYA_ubCmuZxYRQLtQ6ptVaR_Fg-fRMmu3g53PFrW2I94ZA&oe=67B5A3F9"
    },
    {
        name: "Willem Peters",
        position: "Secretary",
        imageUrl: "https://images.squarespace-cdn.com/content/v1/6123eb10d4571b2438df7309/db0e7b5c-b352-4cb8-90e9-7785e611ab52/Willem2.jpg?format=750w"
    },
    {
        name: "Robert King",
        position: "Member at Large",
        imageUrl: "https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-6/470242379_10170344980465515_7156176864152360253_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=rC1NtT067TYQ7kNvgE2sLFr&_nc_oc=AdgMD0UPvFJvC5H2uoSYCIEAbV88SsDJWiWd15QAZJRxns0thjNGNBhAkbr0jJ-bMwM&_nc_zt=23&_nc_ht=scontent-lga3-2.xx&_nc_gid=AVUBt2PTznU6mnzvBDDox9l&oh=00_AYB3wParlZtwXB00e5VlwyAgMZ1As6LkDzPgzLcwnUghKA&oe=67B5A969"
    },
    {
        name: "Frank Morin",
        position: "Member at Large",
    },
    {
        name: "Chris Evans",
        position: "Member at Large",
        imageUrl: "https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-1/441457105_122142756470154814_8544519690550001144_n.jpg?stp=cp6_dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=lPl_BhwEQKMQ7kNvgHFMhlB&_nc_oc=AdjgSqkvK-UJ9dVB994HYiq1HVmr_ycNCeYk-j6L5Q5F-0WxPvOvaQTDsuxIh9riBo0&_nc_zt=24&_nc_ht=scontent-lga3-1.xx&_nc_gid=ASZjAstWhdxvaxLJ9Pec3xZ&oh=00_AYC7xkqns4AimQbbDaVQmk3ie86OK-vj5RJ5m1LmO1Dxlw&oe=67B5A3C4"
    },
    {
        name: "Zach Vaters",
        position: "Member at Large",
        imageUrl: "https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-1/450998672_7824442590983725_7799097376435725416_n.jpg?stp=c512.0.1536.1536a_dst-jpg_s480x480_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=UUE8N8Pl-eoQ7kNvgHmo0nY&_nc_oc=AdgmAmit3_GCmJj_xxmHeQkUEBYspbH3XeM7OO06mB1KBH2L3b4b8GUXE-hYh1HhvR0&_nc_zt=24&_nc_ht=scontent-lga3-1.xx&_nc_gid=AuZpZCmz_8BusmMfWf-5XlI&oh=00_AYCJQCel1oekgJYXS0N6iDIXvm3bxjjD01U8OKlQL-Qovg&oe=67B5BCBD"
    },
    {
        name: "Keegan Pender",
        position: "Junior Officer",
        imageUrl: "https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-1/362234116_256874333790278_2594568931292384727_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e99d92&_nc_ohc=nmiOXttDHZQQ7kNvgE0a6UR&_nc_oc=AdhxWbcjXj6F4G37n9V2NgLKcz4TGLlV3nz76SravuwNT3wwu-Fg8wYSlfoU6WtJ9CM&_nc_zt=24&_nc_ht=scontent-lga3-2.xx&_nc_gid=Aof5ZEbNNNIbGwfcYaTn7vo&oh=00_AYCVBAjMMts8B1ceUdlZQ61BiRVCnQ1AV8fMbHzZaBMkiw&oe=67B5A69B"
    }
]; 
