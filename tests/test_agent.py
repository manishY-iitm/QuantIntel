import pytest
from quantintel.core.agent import QuantAgent
from quantintel.core.schemas import EventStudyResult, AgentTraceStep


def test_agent_preset_execution():
    agent = QuantAgent()
    query = "Investigate FDA advisory committee unanimous vote on Biogen (BIIB) Leqembi approval on June 9, 2023."

    gen = agent.execute_workflow(
        query=query,
        estimation_window=60,
        pre_event_days=3,
        post_event_days=5,
    )

    steps = []
    result = None
    try:
        while True:
            step = next(gen)
            steps.append(step)
    except StopIteration as e:
        result = e.value

    assert len(steps) >= 6
    assert any("TinyFish" in s.title for s in steps)
    assert any("Hypothesis" in s.title for s in steps)
    assert isinstance(result, EventStudyResult)
    assert result.config.ticker == "BIIB"
    assert result.is_statistically_significant is not None
