class RankingService:
    """
    Ranks a list of candidate result dicts by compatibility_score,
    highest first, and annotates each with its rank.
    """

    @staticmethod
    def rank_candidates(candidates: list[dict]) -> list[dict]:
        ranked = sorted(
            candidates,
            key=lambda c: c["compatibility_score"],
            reverse=True,
        )

        for index, candidate in enumerate(ranked, start=1):
            candidate["rank"] = index

        return ranked


def rank_candidates(candidates: list[dict]) -> list[dict]:
    return RankingService.rank_candidates(candidates)
