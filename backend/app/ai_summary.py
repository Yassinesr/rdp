from .config import settings


def explain(data):
    """Optional AI layer: turns today's numbers into coach-style advice.

    Returns None when no OPENAI_API_KEY is configured so the rest of
    the system works without it.
    """
    if not settings.OPENAI_API_KEY:
        return None

    from openai import OpenAI

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = f"""
You are a cycling coach.

Explain today's recommendations clearly.

Data:
{data}
"""

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return res.choices[0].message.content
