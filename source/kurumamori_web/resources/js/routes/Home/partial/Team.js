import React from "react";
import "./Team.css";
import ScrollAnimation from "react-animate-on-scroll";

export default () => {
    const main_text = {
        fontSize: "32px",
        fontWeight: "bold",
        textTransform: "uppercase",
        // marginBottom: "20px",
        // paddingBottom: "20px",
        position: "relative",
        color:"white",
    }
    const sub_text = {
        fontSize: "20px",
        fontWeight: "bold",
        color:"white",
    }
    const sub_text2 = {
        fontSize: "16px",
        fontWeight: "bold",
        color:"white",
    }

    const team_func = (name, position) => {
        return (
            <div className="col-lg-4 col-md-4 col-sm-12 text-center aos-init mb-3 team">
                <ScrollAnimation animateIn='fadeInUp' delay={300} animateOnce={true}>                
                    <div className="member">
                        <img src={`/images/home/team/${name}.jpg`} alt="img" style={{width:"100%", height:"250px", borderRadius:"12px"}}/>
                        <div className="member-info">
                            <div className="member-info-content">
                                <h4 className="mt-2">{name}</h4>
                                <span>{position}</span>
                            </div>
                            <div className="social">
                                <a href=""><i className="icofont-facebook"></i></a>
                                <a href=""><i className="icofont-twitter"></i></a>
                                <a href=""><i className="icofont-instagram"></i></a>
                                <a href=""><i className="icofont-linkedin"></i></a>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        )
    }

    return (
        <section id="intro" className="section intro" style={{background:"#2D405F"}}>
                <div className="team">
                    <div className="row">
                        <div className="col-lg-2 col-md-2 col-sm-3"/>

                        <div className="col-lg-8 col-md-8 col-sm-6">
                            <div className="row justify-content-around pt-5">
                                <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                                    <ScrollAnimation animateIn='fadeIn' animateOnce={true}>
                                        <h3 style={main_text}>Team</h3>
                                        <h3 style={{color:"#00BA94"}}>????????????</h3>
                                        <p style={{color:"white", fontWeight:"600"}}>
                                            ??? ?????? ????????? ??????????????? ?????? ???????????? ?????? & ?????? SOS ?????????
                                        </p>
                                        <p className="pb-3" style={{color:"white", marginBottom:"20px", fontWeight:"600"}}>
                                            ???????????????9 ???????????? ??? MIRO?????????.
                                        </p>
                                    </ScrollAnimation>
                                </div>
                                    {/* ??????, ??????, ????????? */}
                                    {team_func("?????????", "App")}
                                    {team_func("?????????", "HardWare")}
                                    {team_func("?????????", "HardWare")}
                                    {team_func("?????????", "Web")}
                                    {team_func("?????????", "Web")}
                                    {team_func("?????????", "Server")}
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-2 col-sm-3"/>
                    </div>
                </div>
        </section>
    );
}