"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../page.module.css";
import {
  useSchedule,
  useRaceResults,
  useSessionKey,
  useWeather,
  useCircuitInfo,
  useF1ApiDrivers,
  useConstructorStandings,
  useDriverStandings,
  useLatestResults,
  useF1ApiSession,
} from "../../../api";
import PredictiveInsights from "../../../components/PredictiveInsights";
import { getDriverImageUrl, getDriverNumber } from "../../../utils/driverData";
import { getDriverTeamColor, getDriverBorderColor } from "../../../utils/drivers";

type SessionKey =
  | "fp1"
  | "fp2"
  | "fp3"
  | "qualy"
  | "race"
  | "sprint_qualy"
  | "sprint";

export default function RaceWeekendPage({
  params,
}: {
  params: Promise<{ round: string }>;
}) {
  const resolvedParams = use(params);
  const round = parseInt(resolvedParams.round, 10);

  const { data: schedule, isLoading: isScheduleLoading } = useSchedule();
  const raceDetails = schedule?.find((race) => race.round === round);

  const { data: circuitInfo, isLoading: isCircuitInfoLoading } = useCircuitInfo(
    raceDetails?.circuitId || "",
  );
  const { data: f1ApiDriversData, isLoading: isF1ApiDriversLoading } =
    useF1ApiDrivers();
  const {
    data: constructorStandings,
    isLoading: isConstructorStandingsLoading,
  } = useConstructorStandings();
  const { data: driverStandings, isLoading: isDriverStandingsLoading } =
    useDriverStandings();
  const { data: latestResults, isLoading: isLatestResultsLoading } =
    useLatestResults();

  const currentYear = new Date().getFullYear();
  const [selectedSession, setSelectedSession] = useState<SessionKey>("race");
  const { data: sessionStandings, isLoading: isSessionStandingsLoading } =
    useF1ApiSession(currentYear, round, selectedSession);

  const { data: session } = useSessionKey(
    raceDetails?.country || "",
    currentYear,
  );
  const { data: weather } = useWeather(raceDetails?.lat, raceDetails?.long);

  const raceStart = raceDetails
    ? new Date(`${raceDetails.date}T${raceDetails.time || "00:00:00Z"}`)
    : new Date(0);
  const raceEnd = new Date(raceStart.getTime() + 3 * 60 * 60 * 1000);
  const now = new Date();
  const isOngoing = !!raceDetails && now >= raceStart && now <= raceEnd;
  const isCompleted = !!raceDetails && now > raceEnd;
  const isUpcoming = !!raceDetails && now < raceStart;

  const sessionTabs: SessionKey[] = raceDetails?.hasSprint
    ? ["fp1", "sprint_qualy", "sprint", "qualy", "race"]
    : ["fp1", "fp2", "fp3", "qualy", "race"];

  const getSessionLabel = (sessionName: SessionKey) => {
    if (sessionName === "qualy") return "Qualify";
    if (sessionName === "sprint_qualy") return "Sprint Qualify";
    if (sessionName === "sprint") return "Sprint Race";
    return sessionName.toUpperCase();
  };

  const getSessionState = (sessionName: SessionKey) => {
    if (!raceDetails) return "upcoming";

    if (isCompleted) return "completed";

    if (isOngoing) {
      if (sessionName === "race") return "ongoing";
      const currentIndex = sessionTabs.indexOf(sessionName);
      const raceIndex = sessionTabs.indexOf("race");
      return currentIndex < raceIndex ? "completed" : "upcoming";
    }

    if (isUpcoming) return "upcoming";

    return "upcoming";
  };

  useEffect(() => {
    setSelectedSession("race");
  }, [round]);

  if (isScheduleLoading) {
    return (
      <div className={styles.dashboard}>
        <p>Loading race details...</p>
      </div>
    );
  }

  if (!raceDetails) {
    return (
      <div className={styles.dashboard}>
        <p>Race not found.</p>
      </div>
    );
  }

  const selectedSessionState = getSessionState(selectedSession);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {raceDetails.raceName} (Round {round})
          {raceDetails.hasSprint && (
            <span className={styles.sprintBadge}>
              SPRINT WEEKEND
            </span>
          )}
          {isOngoing && (
            <span className={styles.liveBadge}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "inline-block",
                }}
              />
              LIVE ONGOING
            </span>
          )}
        </h1>
        <p className={styles.subtitle}>
          {raceDetails.circuitName} — {raceDetails.locality},{" "}
          {raceDetails.country}
        </p>
        {circuitInfo?.laps && (
          <p
            className={styles.subtitle}
            style={{ marginTop: "8px", color: "#ff2800" }}
          >
            Circuit Laps: {circuitInfo.laps}
          </p>
        )}
      </header>

      <div className={styles.grid}>
        {isOngoing && (
          <section
            className={styles.card}
            style={{
              gridColumn: "span 2",
              borderColor: "#ff2800",
              background:
                "linear-gradient(145deg, rgba(255, 40, 0, 0.08) 0%, rgba(0, 0, 0, 0.2) 100%)",
              boxShadow: "0 4px 20px rgba(255, 40, 0, 0.15)",
            }}
          >
            <h2
              style={{
                color: "#ff2800",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "18px",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#ff2800",
                  animation: "live-pulse 1s infinite",
                }}
              />
              Race is Ongoing
            </h2>
            <div className={styles.cardContent}>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                This Grand Prix is currently live. Completed sessions remain
                available below, the current session is marked ongoing, and
                later sessions are marked upcoming.
              </p>
            </div>
          </section>
        )}

        {!isCompleted && !isOngoing && (
          <section className={styles.card} style={{ gridColumn: "span 2" }}>
            <h2>Upcoming Race Intelligence</h2>
            <div className={styles.cardContent}>
              <p style={{ marginBottom: "16px", color: "#8b949e" }}>
                This race takes place on {raceDetails.date}. Here are the
                predictive AI insights generated for {raceDetails.circuitName}.
              </p>
              <PredictiveInsights
                circuit={raceDetails.circuitName}
                date={raceDetails.date}
                weatherData={weather}
              />
            </div>
          </section>
        )}

        {!isCompleted && !isOngoing && (
          <section className={styles.card} style={{ gridColumn: "span 2" }}>
            <h2>Expected Grid</h2>
            <div className={styles.cardContent}>
              {isF1ApiDriversLoading ||
              isConstructorStandingsLoading ||
              isDriverStandingsLoading ||
              isLatestResultsLoading ? (
                <p>Loading expected grid data...</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {(() => {
                    const drivers = f1ApiDriversData?.drivers
                      ? [...f1ApiDriversData.drivers]
                      : [];
                    const normalize = (value: string) =>
                      value
                        ? value
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .trim()
                        : "";
                    const pastWinnerSurnames =
                      circuitInfo?.pastWinners?.map((winner: any) =>
                        normalize(winner.driver),
                      ) || [];

                    const getConstructorPos = (teamId: string) => {
                      const found = constructorStandings?.find(
                        (constructor: any) =>
                          constructor.Constructor.constructorId === teamId,
                      );
                      return found ? parseInt(found.position, 10) : 999;
                    };

                    const getDriverPos = (driverId: string) => {
                      const found = driverStandings?.find(
                        (driver: any) => driver.Driver.driverId === driverId,
                      );
                      return found ? parseInt(found.position, 10) : 999;
                    };

                    const getPrevTop3Pos = (driverId: string) => {
                      const found = latestResults?.find(
                        (result: any) => result.driver.id === driverId,
                      );
                      return found && found.position <= 3
                        ? found.position
                        : 999;
                    };

                    const getPastWins = (surname: string) =>
                      pastWinnerSurnames.filter(
                        (item: string) => item === normalize(surname),
                      ).length;

                    const driversWithIndex = drivers.map(
                      (driver: any, index: number) => ({
                        ...driver,
                        originalIndex: index,
                      }),
                    );

                    const sortedDrivers = driversWithIndex.sort(
                      (a: any, b: any) => {
                        const aCPos = getConstructorPos(a.teamId);
                        const bCPos = getConstructorPos(b.teamId);
                        if (aCPos !== bCPos) return aCPos - bCPos;

                        const aDPos = getDriverPos(a.driverId);
                        const bDPos = getDriverPos(b.driverId);
                        if (aDPos !== bDPos) return aDPos - bDPos;

                        const aPrev = getPrevTop3Pos(a.driverId);
                        const bPrev = getPrevTop3Pos(b.driverId);
                        if (aPrev !== bPrev) return aPrev - bPrev;

                        const aWins = getPastWins(a.surname);
                        const bWins = getPastWins(b.surname);
                        if (aWins !== bWins) return bWins - aWins;

                        return a.originalIndex - b.originalIndex;
                      },
                    );

                    return sortedDrivers.map((driver: any, index: number) => {
                      const isPastWinner = pastWinnerSurnames.includes(
                        normalize(driver.surname),
                      );
                      const isP1 = index === 0;
                      const useGoldStyle = isP1 || isPastWinner;
                      const driverImgUrl = getDriverImageUrl(driver.driverId);
                      const driverNum =
                        getDriverNumber(driver.driverId) ?? driver.number;

                      return (
                        <Link
                          href={`/drivers/${driver.driverId}`}
                          key={driver.driverId}
                          style={{ textDecoration: "none", display: "flex" }}
                        >
                          <div
                            style={{
                              padding: "12px",
                              background: useGoldStyle
                                ? "rgba(255, 215, 0, 0.05)"
                                : "rgba(255, 255, 255, 0.05)",
                              border: `1px solid ${useGoldStyle ? "rgba(255, 215, 0, 0.5)" : "#30363d"}`,
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                              width: "100%",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = useGoldStyle
                                ? "rgba(255, 215, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.1)";
                              e.currentTarget.style.borderColor = useGoldStyle
                                ? "#ffd700"
                                : "#ff2800";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = useGoldStyle
                                ? "rgba(255, 215, 0, 0.05)"
                                : "rgba(255, 255, 255, 0.05)";
                              e.currentTarget.style.borderColor = useGoldStyle
                                ? "rgba(255, 215, 0, 0.5)"
                                : "#30363d";
                            }}
                          >
                            <div
                              style={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: useGoldStyle ? "#ffd700" : "#ff2800",
                                width: "40px",
                                textAlign: "center",
                                fontFamily: "monospace",
                              }}
                            >
                              P{index + 1}
                            </div>
                            {driverImgUrl ? (
                              <img
                                src={driverImgUrl}
                                alt={`${driver.name} ${driver.surname}`}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  objectPosition: "top",
                                  backgroundColor: getDriverTeamColor(driver.driverId),
                                  border: `2px solid ${getDriverBorderColor(driver.driverId)}`,
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(255,255,255,0.05)",
                                  border: `2px solid ${getDriverBorderColor(driver.driverId)}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "14px",
                                  color: "#8b949e",
                                  fontFamily: "monospace",
                                }}
                              >
                                {driverNum || "-"}
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span
                                style={{
                                  color: "#c9d1d9",
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                {driver.name} {driver.surname}
                                {isPastWinner && (
                                  <span title="Past Winner at this circuit">
                                    🏆
                                  </span>
                                )}
                              </span>
                              <span
                                style={{
                                  color: "#8b949e",
                                  fontSize: "12px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {driver.teamId?.replace("_", " ")} | #
                                {driverNum || "-"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    });
                  })()}
                  {!f1ApiDriversData?.drivers?.length && (
                    <p>No drivers found for this season.</p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {!isUpcoming && (
          <section className={styles.card} style={{ gridColumn: "span 2" }}>
            <div className={styles.standingsHeader}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  background: "linear-gradient(to right, #ffffff, #8b949e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Session Standings
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  overflowX: "visible",
                  paddingBottom: "4px",
                  scrollbarWidth: "none",
                  flexWrap: "wrap",
                  rowGap: "10px",
                }}
              >
                {sessionTabs.map((sessionName) => {
                  const sessionState = getSessionState(sessionName);
                  const showStatusPill = !isCompleted;

                  return (
                    <button
                      key={sessionName}
                      onClick={() => setSelectedSession(sessionName)}
                      style={{
                        padding: "10px 20px",
                        background:
                          selectedSession === sessionName
                            ? "linear-gradient(135deg, #ff2800, #ff5e00)"
                            : "rgba(255, 255, 255, 0.03)",
                        color:
                          selectedSession === sessionName ? "#fff" : "#8b949e",
                        border: "none",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontSize: "13px",
                        boxShadow:
                          selectedSession === sessionName
                            ? "0 4px 15px rgba(255, 40, 0, 0.4)"
                            : "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        flexShrink: 0,
                        opacity: sessionState === "upcoming" ? 0.72 : 1,
                      }}
                      title={
                        sessionState === "upcoming"
                          ? "Yet to happen"
                          : sessionState === "ongoing"
                            ? "Live session"
                            : "Completed session"
                      }
                      onMouseEnter={(e) => {
                        if (selectedSession !== sessionName) {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.08)";
                          e.currentTarget.style.color = "#fff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSession !== sessionName) {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.03)";
                          e.currentTarget.style.color = "#8b949e";
                        }
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {getSessionLabel(sessionName)}
                        {showStatusPill && (
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "3px 8px",
                              borderRadius: "999px",
                              background:
                                sessionState === "ongoing"
                                  ? "rgba(255, 40, 0, 0.18)"
                                  : sessionState === "completed"
                                    ? "rgba(63, 185, 80, 0.16)"
                                    : "rgba(210, 153, 34, 0.18)",
                              color:
                                sessionState === "ongoing"
                                  ? "#ff8b7a"
                                  : sessionState === "completed"
                                    ? "#7ee787"
                                    : "#f2cc60",
                              textTransform: "none",
                              letterSpacing: "0.2px",
                            }}
                          >
                            {sessionState === "ongoing"
                              ? "Live"
                              : sessionState === "completed"
                                ? "Done"
                                : "Upcoming"}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.cardContent}>
              {selectedSessionState === "upcoming" ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                  }}
                >
                  <p style={{ color: "#d29922" }}>
                    This session is yet to happen.
                  </p>
                </div>
              ) : isSessionStandingsLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                  }}
                >
                  <p style={{ color: "#8b949e", animation: "pulse 2s infinite" }}>
                    Loading session data...
                  </p>
                </div>
              ) : sessionStandings && sessionStandings.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {sessionStandings
                    .slice(0, 22)
                    .map((item: any, index: number) => {
                      const driver = item.driver || {};
                      const team = item.team || {};
                      const position =
                        item.position || item.gridPosition || index + 1;
                      const timeOrStatus =
                        item.time ||
                        item.status ||
                        item.q3 ||
                        item.q2 ||
                        item.q1 ||
                        "-";
                      const driverId = driver.driverId || driver.id || "";
                      const driverNum =
                        getDriverNumber(driverId) ?? driver.number;
                      const isP1 = parseInt(position, 10) === 1;

                      return (
                        <Link
                          href={`/drivers/${driver.driverId || driver.id}`}
                          key={index}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              padding: "16px",
                              background: isP1
                                ? "linear-gradient(145deg, rgba(255, 215, 0, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)"
                                : "linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                              boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                              border: isP1
                                ? "1px solid rgba(255, 215, 0, 0.3)"
                                : "1px solid rgba(255, 255, 255, 0.05)",
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              cursor: "pointer",
                              position: "relative",
                              overflow: "hidden",
                              height: "100%",
                              boxSizing: "border-box",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-3px)";
                              e.currentTarget.style.boxShadow = isP1
                                ? "0 8px 20px rgba(255, 215, 0, 0.25)"
                                : "0 8px 20px rgba(255, 40, 0, 0.15)";
                              e.currentTarget.style.borderColor = isP1
                                ? "#ffd700"
                                : "rgba(255, 40, 0, 0.4)";
                              e.currentTarget.style.background = isP1
                                ? "linear-gradient(145deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)"
                                : "linear-gradient(145deg, rgba(255, 40, 0, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 6px rgba(0,0,0,0.2)";
                              e.currentTarget.style.borderColor = isP1
                                ? "rgba(255, 215, 0, 0.3)"
                                : "rgba(255, 255, 255, 0.05)";
                              e.currentTarget.style.background = isP1
                                ? "linear-gradient(145deg, rgba(255, 215, 0, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)"
                                : "linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)";
                            }}
                          >
                            <div
                              style={{
                                fontSize: "28px",
                                fontWeight: "900",
                                background: isP1
                                  ? "linear-gradient(to right, #ffd700, #ffa500)"
                                  : "linear-gradient(to right, #ff2800, #ff8c00)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                width: "45px",
                                textAlign: "center",
                                fontFamily: "monospace",
                                fontStyle: "italic",
                                lineHeight: "1",
                                flexShrink: 0,
                              }}
                            >
                              {position}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                zIndex: 1,
                                minWidth: 0,
                              }}
                            >
                              <span
                                style={{
                                  color: "#ffffff",
                                  fontWeight: "700",
                                  fontSize: "15px",
                                  letterSpacing: "0.5px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {driver.name}{" "}
                                <span style={{ textTransform: "uppercase" }}>
                                  {driver.surname}
                                </span>
                              </span>
                              <span
                                style={{
                                  color: "#8b949e",
                                  fontSize: "12px",
                                  marginTop: "4px",
                                  textTransform: "uppercase",
                                  fontWeight: "bold",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {team.name}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                zIndex: 1,
                                flexShrink: 0,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  color: "#ff2800",
                                  fontFamily: "monospace",
                                }}
                              >
                                #{driverNum}
                              </div>
                              <div
                                style={{
                                  marginTop: "4px",
                                  fontSize: "12px",
                                  color: "#8b949e",
                                  fontWeight: "600",
                                  background: "rgba(0,0,0,0.3)",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  border: "1px solid rgba(255,255,255,0.05)",
                                  flexShrink: 0,
                                }}
                              >
                                {timeOrStatus}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                  }}
                >
                  <p style={{ color: "#8b949e" }}>
                    No results available for this session.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className={styles.card} style={{ gridColumn: "span 2" }}>
          <h2>Past Winners</h2>
          <div className={styles.cardContent}>
            {isCircuitInfoLoading ? (
              <p>Loading past winners...</p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                {circuitInfo?.pastWinners?.map((winner: any, index: number) => (
                  <li
                    key={index}
                    style={{
                      flex: "1 1 200px",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "900",
                        color: "#ff2800",
                        fontSize: "20px",
                        marginBottom: "4px",
                      }}
                    >
                      {winner.year}
                    </div>
                    <div
                      style={{
                        color: "#c9d1d9",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {winner.driver}
                    </div>
                    <div
                      style={{
                        color: "#8b949e",
                        fontSize: "14px",
                        marginTop: "2px",
                      }}
                    >
                      {winner.team}
                    </div>
                  </li>
                ))}
                {!circuitInfo?.pastWinners?.length && (
                  <p>No past winners found.</p>
                )}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
