export declare class ProposalStateRepository {
    private activeProposals;
    hasActiveProposal(userId: string): Promise<boolean>;
    setActiveProposal(userId: string, active: boolean): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=ProposalStateRepository.d.ts.map