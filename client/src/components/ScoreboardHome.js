import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import { loginAsScoreboardViewer, fetchGameState } from '../reducers/scoreboard';
import Loader from './Loader';

const CenterLoader = () => {
  return (
    <Container fluid className="full-screen center">
      <Row className="focus-center">
        <Col>
          <Loader />
        </Col>
      </Row>
    </Container>
  );
};

const Header = () => {
  const round = useSelector(state => state.scoreboard.round);
  const questionNo = useSelector(state => state.scoreboard.questionNo);
  const category = useSelector(state => state.scoreboard.category);
  const question = useSelector(state => state.scoreboard.question);

  return (
    <>
      <Row>
        <Col>
          <h1 style={{ float: 'left' }}>Round {round}</h1>
        </Col>
        <Col>
          <h1 style={{ textAlign: 'center' }}>{category}</h1>
        </Col>
        <Col>
          <h1 style={{ float: 'right' }}>Question {questionNo}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1 style={{ textAlign: 'center', fontSize: '4rem' }}>{question}</h1>
        </Col>
      </Row>
    </>
  );
};

const TeamStatus = ({ team, pos }) => {
  const questionClosed = useSelector(state => state.scoreboard.questionClosed);

  if (!team) {
    return <Col />;
  }

  return (
    <Col>
      <div className="team-status">
        <div className="info">
          <span className="pos">{pos}</span>
          <span className="round-points">{team.roundPoints}RP</span>
          <span className="round-score">{team.roundScore}/12</span>
        </div>
        <div className="team">
          <span className="name">{team.name}</span>
          {questionClosed ? (
            <>
              {team.guessCorrect ? (
                <span className="status" role="img" aria-label="Correct guess">
                  ✔️
                </span>
              ) : (
                <span className="status" role="img" aria-label="Incorrect guess">
                  ❌
                </span>
              )}
            </>
          ) : (
            <>
              {!team.guess && (
                <span className="status" role="img" aria-label="The team is thinking of a guess">
                  💭
                </span>
              )}
            </>
          )}
        </div>
        {questionClosed && (
          <div className="guess">
            <span className="guess">{team.guess || '-'}</span>
          </div>
        )}
      </div>
    </Col>
  );
};

const TeamStatuses = () => {
  const scoreboardTeams = useSelector(state => state.scoreboard.teams);

  if (!scoreboardTeams) {
    return <></>;
  }

  const teams = scoreboardTeams.slice().sort((a, b) => a.roundPoints < b.roundPoints);

  return (
    <>
      <Row className="big top-anxiety">
        <TeamStatus pos={1} team={teams[0]} />
        <TeamStatus pos={2} team={teams[1]} />
      </Row>
      <Row className="big top-anxiety">
        <TeamStatus pos={3} team={teams[2]} />
        <TeamStatus pos={4} team={teams[3]} />
      </Row>
      <Row className="big top-anxiety">
        <TeamStatus pos={5} team={teams[4]} />
        <TeamStatus pos={6} team={teams[5]} />
      </Row>
    </>
  );
};

const ScoreBoard = () => {
  const dispatch = useDispatch();
  const roomCode = useSelector(state => state.scoreboard.roomCode);

  useEffect(() => {
    dispatch(fetchGameState(roomCode));
  }, [dispatch, roomCode]);

  return (
    <Container fluid className="top-anxiety">
      <Header />
      <TeamStatuses />
    </Container>
  );
};

const ScoreboardHome = ({
  match: {
    params: { roomCode },
  },
}) => {
  const dispatch = useDispatch();
  const triedConnectingToRoom = useSelector(state => state.scoreboard.triedConnectingToRoom);
  const connectedToRoom = useSelector(state => state.scoreboard.connectedToRoom);
  const connectingToRoom = useSelector(state => state.scoreboard.connectingToRoom);

  useEffect(() => {
    if (!connectingToRoom && !triedConnectingToRoom) {
      dispatch(loginAsScoreboardViewer(roomCode));
    }
  }, [dispatch, roomCode, connectingToRoom, triedConnectingToRoom]);

  if (!triedConnectingToRoom) {
    return <CenterLoader />;
  } else if (!connectedToRoom) {
    return <Redirect to="/" />;
  }
  return <ScoreBoard />;
};

export default ScoreboardHome;
