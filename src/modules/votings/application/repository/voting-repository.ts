import { Live } from '@/modules/lives/domain/live';
import { Voting } from '../../domain/voting';

export interface VotingRepository {
  findByLiveId(liveId: string): Promise<Voting[]>;
  findById(votingId: string): Promise<Voting>;
  findLive(liveId: string): Promise<Live>;
  save(voting: Voting): Promise<void>;
  update(voting: Voting): Promise<void>;
}
