import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, ManyToOne, JoinColumn, Relation } from "typeorm";
import { Item } from "./item.entity";
import { Location } from "./location.entity";

enum StatusEnum {
    APPROVE = 'approve',
    REJECT = 'reject'
}

@Entity('transactions')
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'src_item_id' })
    srcItemId!: string;

    @ManyToOne('Item', 'transactions')
    @JoinColumn({
        name: 'src_item_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'FK_items_transactions'
    })
    item?: Relation<Item>;

    @Column({ name: 'dst_location_id' })
    dstLocationId!: string;

    @ManyToOne('Location', 'transactions')
    @JoinColumn({
        name: 'dst_location_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'FK_locations_transactions'
    })
    location?: Relation<Location>;

    @Column({ type: "integer" })
    qty!: number;

    @Column({ type: 'enum', enum: StatusEnum, nullable: true })
    status?: StatusEnum

    @Column({ type: 'timestamp with time zone', name: 'approve_at', nullable: true })
    approveAt?: Date

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
        name: 'deleted_at',
        type: 'timestamp with time zone',
        default: null,
    })
    deletedAt!: Date | null;
}